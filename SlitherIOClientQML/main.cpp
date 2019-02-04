#include <QGuiApplication>
#include <QQmlApplicationEngine>
#include <QQmlContext>

#include "Client.h"
#include "Map.h"
#include "MapProvider.h"
#include "Snake.h"

int main(int argc, char *argv[])
{
    QGuiApplication app(argc, argv);    

    qmlRegisterType<Client>("com.steinsvik.slitherio", 1, 0, "Client");
    qmlRegisterType<Map>("com.steinsvik.slitherio", 1, 0, "Map");    
    qmlRegisterType<Snake>("com.steinsvik.slitherio", 1, 0, "Snake");        

    QQmlApplicationEngine engine;    

    Client *client = new Client();
    MapProvider *mapProvider = new MapProvider();
    mapProvider->setClient(client);

    engine.addImageProvider("MapProvider", mapProvider);
    engine.rootContext()->setContextProperty("client", client);
    engine.load(QUrl(QStringLiteral("qrc:/main.qml")));

    return app.exec();
}
