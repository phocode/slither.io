#ifndef CLIENT_H
#define CLIENT_H

#include <QObject>
#include <QTcpSocket>
#include <QDebug>
#include <QTimer>
#include <QColor>

#include "Snake.h"
#include "Bait.h"
#include "Setting.h"
#include "Logger.h"

class Client : public QObject
{
    Q_OBJECT
public:
    explicit Client(QObject *parent = 0);
    ~Client();

    Q_INVOKABLE void connect(QString, int);
    Q_INVOKABLE void disconnect();

    void processData(QString);
    void processData2(QString);     //  newer version
    void processCommand(QString);

    Q_INVOKABLE Snake *getSnake() const;
    void setSnake(Snake *value);    

    Q_INVOKABLE void setMouse(int, int);        

    Bait *getBait() const;
    void setBait(Bait *value);

    QList<Snake *> getEnemies() const;
    void setEnemies(const QList<Snake *> &value);    

    Q_INVOKABLE bool getInGame() const;
    Q_INVOKABLE void setInGame(bool value);

    void reset();

    Q_INVOKABLE QString getNotificationText() const;
    Q_INVOKABLE void setNotificationText(const QString &value);

    Q_INVOKABLE QString getPlayerPositions();

    Q_INVOKABLE void setSnakeName(QString);

    Q_INVOKABLE int totalPlayers();

    Q_INVOKABLE void accelerate();
    Q_INVOKABLE void stopAccelerate();
signals:

public slots:    
    void connected();
    void disconnected();
    void sendData(QString);
    void readData();

private:
    QTcpSocket      *socket;
    QTimer          *timer;
    Setting         *setting;
    Logger          *logger;
    Snake           *snake;
    QList<Snake*>   enemies;
    Bait            *bait;

    int mouse_x;
    int mouse_y;

    bool inGame = false;
    QString notificationText;

    QString previousMessage;
    QString previousCommand;
    QString command;
};

#endif // CLIENT_H
