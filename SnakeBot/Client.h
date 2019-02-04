#ifndef CLIENT_H
#define CLIENT_H

#include <QObject>
#include <QTcpSocket>
#include <QTimer>
#include <QDebug>
#include <cstdlib>

class Client : public QObject
{
    Q_OBJECT
public:
    explicit Client(QObject *parent = 0);
    ~Client();
    void connect(QString, int);
    void disconnect();

signals:

public slots:
    void connected();
    void disconnected();
    void sendData(QString);
    void readData();
    void timeout();

private:
    QTcpSocket *socket;
    QTimer *timer;
};

#endif // CLIENT_H
