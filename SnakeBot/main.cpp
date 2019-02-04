#include <QCoreApplication>
#include "Client.h"
#include <csignal>
#include <QDebug>

Client *client;

struct CleanExit {
    CleanExit() {
        signal(SIGINT, &CleanExit::exitQt);
        signal(SIGTERM, &CleanExit::exitQt);
        signal(SIGBREAK, &CleanExit::exitQt);
    }

    static void exitQt(int sig) {
        client->disconnect();
        QCoreApplication::exit(0);
    }
};

int main(int argc, char *argv[])
{
    CleanExit cleanExit;
    QCoreApplication a(argc, argv);
    client = new Client();

    return a.exec();
}
