#include "Client.h"

Client::Client(QObject *parent) : QObject(parent)
{
    socket = new QTcpSocket();
    QObject::connect(socket, SIGNAL(connected()),
                     this, SLOT(connected()));
    QObject::connect(socket, SIGNAL(disconnected()),
                     this, SLOT(disconnected()));
    QObject::connect(socket, SIGNAL(readyRead()),
                     this, SLOT(readData()));
    this->connect("127.0.0.1", 3000);

    timer = new QTimer();
    QObject::connect(timer, SIGNAL(timeout()),
                     this, SLOT(timeout()));
    timer->setInterval(1000);
    timer->start();
}

Client::~Client() {
    socket->disconnectFromHost();
    delete socket;
}

void Client::connect(QString ip = "127.0.0.1", int port = 3000) {
    socket->connectToHost(ip, port);    
    socket->write("9,Dummy Bot,");
}

void Client::disconnect() {
    socket->disconnectFromHost();
    socket->waitForDisconnected();
}

void Client::connected()
{
    qDebug() << "Connection to server is established";
}

void Client::disconnected()
{
    this->connect("127.0.0.1", 3000);    
    qDebug() << "Connection to server is lost";
}

void Client::sendData(QString data)
{
    if(socket->isOpen()) socket->write(data.toUtf8());
}

void Client::readData()
{
    QString data = socket->readAll();
    //qDebug() << data;
}

void Client::timeout() {
    int x = rand() % (1261) + 10;
    int y = rand() % (711) + 10;
    QString data = QString("2,") +
            QString::number(x) +
            QString(",") +
            QString::number(y) +
            QString(",1280,720");
    sendData(data);
}

