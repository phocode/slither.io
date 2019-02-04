#include "Client.h"
#include <QQmlProperty>
#include <iostream>
using namespace std;
Client::Client(QObject *parent) : QObject(parent)
{
    //  Create socket object
    socket = new QTcpSocket();    
    socket->setSocketOption(QAbstractSocket::KeepAliveOption, 1);
    QObject::connect(socket, SIGNAL(connected()), this, SLOT(connected()));
    QObject::connect(socket, SIGNAL(disconnected()), this, SLOT(disconnected()));
    QObject::connect(socket, SIGNAL(readyRead()), this, SLOT(readData()));

    //  Create snake object
    snake = new Snake();

    //  Create bait object
    bait = new Bait();    

    //  Create setting object
    setting = new Setting();
    setting->readSetting();

    //  Craete logger object
    logger = new Logger();
}

Client::~Client()
{
    socket->disconnectFromHost();
    delete socket;
}

void Client::connect(QString ip = "127.0.0.1", int port = 3000)
{
//    socket->connectToHost(ip, port);
    qDebug() << this->setting->getCONFIG_SERVER_IP()
             << ":"
             << this->setting->getCONFIG_SERVER_PORT();
    socket->connectToHost(this->setting->getCONFIG_SERVER_IP(),
                          this->setting->getCONFIG_SERVER_PORT());
    socket->waitForConnected();
    inGame = true;
}

void Client::disconnect()
{
    socket->disconnectFromHost();
    socket->waitForDisconnected();
    socket->close();
}

/*
 *  THIS METHOD IS NOW LEGACY... POOR IT
 */
void Client::processData(QString data)
{                
    QStringList messages = data.split('$');
    foreach(QString msg, messages) {
//        qDebug() << "Processing: " << msg;
        QStringList splitted = msg.split(',');
        int CODE = QString(splitted.at(0)).toInt();        
        int n = splitted.length();
        int en = enemies.length();

        if(CODE != 8) this->previousMessage = data;
        QList<double> x;
        QList<double> y;

        Snake *snake;                
        switch(CODE) {
        case 1:     //  PLAYER'S SNAKE CREATED            
            //qDebug() << CODE << " Player created";
            for(int i = 1 ; i < n ; i += 2) {
                this->snake->push_node(QString(splitted.at(i)).toDouble(),
                                       QString(splitted.at(i + 1)).toDouble());
            }
            break;

        case 2:     //  UPDATE PLAYER'S SNAKE                        
            if(splitted.length() % 2 == 0) break;   //  missing data due to network error
            for(int i = 1 ; i < n ; i += 2) {
                x.append(QString(splitted.at(i)).toDouble());
                y.append(QString(splitted.at(i + 1)).toDouble());
            }            
            this->snake->update_nodes(x, y);
            break;

        case 21:    //  UPDATE PLAYER'S SNAKE - SEND ONLY HEAD
            //qDebug() << CODE << " Update player's snake head only";
            this->snake->update_head(QString(splitted.at(1)).toDouble(),
                                     QString(splitted.at(2)).toDouble());
            break;

        case 22:    //  PLAYER's SNAKE GROWS
            //qDebug() << CODE << " You are growing";
            this->snake->grow();
            break;

        case 3:     //  NEW BAIT
            //qDebug() << CODE << " New bait";
            if(splitted.length() % 2) break;        // missing data due to network error
            this->bait->addBait(QString(splitted.at(1)).toDouble(), // x
                                QString(splitted.at(2)).toDouble(),  // y
                                QString(splitted.at(3)).toDouble(),
                                QColor(qrand() % (256), qrand() % (256), qrand() % (256))); // size
            break;

        case 4:     //  DELETE BAIT
            //qDebug() << CODE << " Delete bait";
            if(splitted.length() % 2 == 0) break;    // missing data due to network error
            this->bait->deleteBait(QString(splitted.at(1)).toDouble(),
                                   QString(splitted.at(2)).toDouble());
            break;

        case 5:     //  NEW ENEMY
            //qDebug() << CODE << " New enemy";
            if(splitted.length() % 2 && splitted.length() != 22) break;       // missing data due to network error
            snake = new Snake();
            snake->setId(QString(splitted.at(1)));
            for(int i = 2 ; i < n ; i += 2) {
                snake->push_node(QString(splitted.at(i)).toDouble(),
                                 QString(splitted.at(i + 1)).toDouble());
            }
            enemies.append(snake);
            break;

        case 6:     //  UPDATE ENEMY            
            if(n % 2) break;            //  missing data due to network error
            for(int i = 0 ; i < en ; i++) {
                if(enemies.at(i)->getId() == QString(splitted.at(1))) {
                    for(int j = 2 ; j < n ; j += 2) {
                        x.append(QString(splitted.at(j)).toDouble());
                        y.append(QString(splitted.at(j + 1)).toDouble());
                    }
                    enemies.at(i)->update_nodes(x, y);
                    break;
                }
            }
            break;

        case 61:    //  UPDATE ENEMY - SEND ONLY HEAD
            //qDebug() << CODE << " Update enemy head only";
            for(int i = 0 ; i < en ; i++) {
                if(enemies.at(i)->getId() == QString(splitted.at(1))) {                    
                    enemies.at(i)->update_head(QString(splitted.at(2)).toDouble(),
                                               QString(splitted.at(3)).toDouble());
                    break;
                }
            }
            break;

        case 62:    //  ENEMY GROW
            //qDebug() << CODE << " Enemy grow";
            for(int i = 0 ; i < en ; i++) {
                if(enemies.at(i)->getId() == QString(splitted.at(1))) {
                    enemies.at(i)->grow();
                    break;
                }
            }
            break;

        case 7:     //  DEAD ENEMY
            //qDebug() << CODE << " Dead enemy";
            if(splitted.length() < 2) break;    // missing data due to network error
            for(int i = 0 ; i < en ; i++) {
                if(enemies.at(i)->getId() == QString(splitted.at(1))) {
                    enemies.removeAt(i);
                    break;
                }
            }
            break;

        case 8:     //  YOU ARE DEAD
            //qDebug() << CODE << " You are dead";
            logger->write(QString::number(CODE) + " - You are dead");
            logger->write("Previous message: " + this->previousMessage);
            logger->write("Original message: " + data);
            if(splitted.length() == 1) break;    // missing data or too much data due to network error
            this->disconnect();
            this->reset();
            this->setInGame(false);
            this->setNotificationText("You lose. Thanks for playing");
            break;

        default:            
            break;
        }
    }
}

/*
 *  USE THIS NEW ONE INSTEAD
 */
void Client::processData2(QString data)
{            
    bool haveDollar = false;
    int  dollarIndex = -1;
    for(int i = 0 ; i < data.length() ; i++)
        if(data.at(i) == '$') {
            haveDollar = true;
            dollarIndex = i;
            break;
        }
    QStringList commands = data.split('$');
    if(haveDollar == false) {
        if(this->previousCommand.isEmpty() == false) {
            this->previousCommand += data;
        }
    } else {
        int i = 0;
        if(dollarIndex == 0) {
            if(this->previousCommand.isEmpty() == false) {
                processCommand(previousCommand);
                previousCommand = "";
            }            
        } else {
            previousCommand += commands.at(0);
            i = 1;
        }
        int n = commands.length();
        for(; i < n - 1 ; i++) {
            processCommand(commands.at(i));
        }
        previousCommand = commands.at(n - 1);
    }
}

void Client::processCommand(QString cmd)
{        
    if(cmd.isEmpty()) return;
    QStringList splitted = cmd.split(',');
    int CODE = QString(splitted.at(0)).toInt();
    int n = splitted.length();
    int en = enemies.length();    
    QList<double> x;
    QList<double> y;

    Snake *snake;
    QString content = "";

    bool foundUpdatedEnemy = false;

    switch(CODE) {
    case 1:     //  PLAYER'S SNAKED CREATED
        for(int i = 1; i < n ; i += 2) {
            this->snake->push_node(QString(splitted.at(i)).toDouble(),
                                   QString(splitted.at(i + 1)).toDouble());
        }
        break;
    case 2:     //  UPDATE PLAYER'S SNAKE
        for(int i = 1 ; i < n ; i += 2) {
            x.append(QString(splitted.at(i)).toDouble());
            y.append(QString(splitted.at(i + 1)).toDouble());
        }
        this->snake->update_nodes(x, y);
        break;
    case 21:    //  UPDATE PLAYER'S SAKE - SEND ONLY HEAD
        break;
    case 22:    //  PLAYER's SNAKE GROWING
        break;
    case 3:     //  NEW BAIT

        this->bait->addBait(QString(splitted.at(1)).toDouble(),
                            QString(splitted.at(2)).toDouble(),
                            QString(splitted.at(3)).toDouble(),
                            QColor(qrand() % (256), qrand() % (256), qrand() % (256)));
        break;
    case 4:     //  DELETE BAIT
        this->bait->deleteBait(QString(splitted.at(1)).toDouble(),
                               QString(splitted.at(2)).toDouble());
        break;
    case 5:     //  NEW ENEMY                
        snake = new Snake();
        snake->setId(QString(splitted.at(1)));        
        snake->setName(QString(splitted.at(2)));

        for(int i = 3 ; i < n ; i += 2) {
            snake->push_node(QString(splitted.at(i)).toDouble(),
                             QString(splitted.at(i + 1)).toDouble());
        }
        enemies.append(snake);

        break;
    case 6:     //  UPDATE ENEMY

        for(int i = 0 ; i < en ; i++) {
            if(enemies.at(i)->getId() == QString(splitted.at(1))) {
                for(int j = 2 ; j < n ; j += 2) {
                    x.append(QString(splitted.at(j)).toDouble());
                    y.append(QString(splitted.at(j + 1)).toDouble());
                }
                enemies.at(i)->update_nodes(x, y);
                foundUpdatedEnemy = true;
                break;
            }
        }

        /*
         *  Some enemy have not been sent due to network error
         */
        if(!foundUpdatedEnemy) {
            snake = new Snake();
            snake->setId(QString(splitted.at(1)));
            snake->setName("Unknown");

            for(int j = 2 ; j < n ; j += 2) {
                x.append(QString(splitted.at(j)).toDouble());
                y.append(QString(splitted.at(j + 1)).toDouble());
            }
            enemies.append(snake);
        }
        break;
    case 61:    //  UPDATE ENEMY - SEND ONLY HEAD
        break;
    case 62:    //  ENEMY GROW
        break;
    case 7:     //  ENEMY DIE
        for(int i = 0 ; i < en ; i++) {
            if(enemies.at(i)->getId() == QString(splitted.at(1))) {
                enemies.removeAt(i);
                break;
            }
        }
        break;
    case 8:     //  YOU DIE        
        content = QString::number(CODE) + " - You are dead";
        content += "\n Pre: " + this->previousCommand;
        content += "\n New: " + cmd;
        logger->setContent(content);
        logger->start();        
        this->disconnect();
        this->reset();
        this->setInGame(false);
        this->setNotificationText("You lose. Thanks for playing");
        break;

    case 9:     //  ENEMY UPDATE NAME
        for(int i = 0 ; i < en ; i++) {
            if(enemies.at(i)->getId() == splitted.at(1)) {
                enemies.at(i)->setName(splitted.at(2));
                break;
            }
        }
        break;
    default:
        break;
    }
}

void Client::connected()
{
    this->reset();
    qDebug() << "Connection to server is established";
    logger->write("Connection to server is established");
}

void Client::disconnected()
{
    qDebug() << "Connection to server is lost";
    logger->write("Connection to server is lost");
    this->reset();
    this->setInGame(false);
    this->setNotificationText("You lose. Thanks for playing");
    if(this->socket->error()) {
        logger->write(socket->errorString());
    }
}

void Client::sendData(QString data)
{
    if(socket->isOpen()){
        socket->write(data.toUtf8());
    }
}

void Client::readData()
{
    QString data = socket->readAll();
    processData2(data);
}

QString Client::getNotificationText() const
{
    return notificationText;
}

void Client::setNotificationText(const QString &value)
{
    notificationText = value;
}

QString Client::getPlayerPositions()
{
    if(socket->isOpen() == false) return ",";
    qDebug() << "                                                "
             << this->snake->getX().first()
             << ","
             << this->snake->getY().first()
             << " - "
             << this->enemies.first()->getX().first()
             << ","
             << this->enemies.first()->getY().first();
    return "";
}

void Client::setSnakeName(QString name)
{
    QString temp = name;
    int n = temp.length();
    for(int i = 0 ; i < n ; i++) {
        if(temp.at(i) == ',' || temp.at(i) == '$') {
            temp.replace(i, QString(""));
        }
    }
    this->snake->setName(temp);
}

int Client::totalPlayers()
{
    return enemies.length() + 1;
}

void Client::accelerate()
{
    this->sendData("10");
}

void Client::stopAccelerate()
{
    this->sendData("11");
}

bool Client::getInGame() const
{
    return inGame;
}

void Client::setInGame(bool value)
{
    inGame = value;
}

void Client::reset()
{    
    //  Create snake object
    snake = new Snake();

    //  Create bait object
    bait = new Bait();

    //  Create setting object
    setting = new Setting();
    setting->readSetting();

    //  Create logger object
    logger = new Logger();

    enemies.clear();

    this->setting->readSetting();

    this->inGame = true;
}

QList<Snake *> Client::getEnemies() const
{
    return enemies;
}

void Client::setEnemies(const QList<Snake *> &value)
{
    enemies = value;
}

Bait *Client::getBait() const
{
    return bait;
}

void Client::setBait(Bait *value)
{
    bait = value;
}

void Client::setMouse(int x, int y)
{
    this->mouse_x = x;
    this->mouse_y = y;
}

Snake *Client::getSnake() const
{
    return snake;
}

void Client::setSnake(Snake *value)
{
    snake = value;
}
