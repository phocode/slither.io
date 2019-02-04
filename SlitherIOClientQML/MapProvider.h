#ifndef MAPPROVIDER_H
#define MAPPROVIDER_H

#include <QObject>
#include <QQuickImageProvider>
#include <QStringList>
#include <QDebug>
#include <QPainter>
#include <QBrush>

#include "Map.h"
#include "Bait.h"
#include "Snake.h"
#include "Client.h"

class MapProvider : public QQuickImageProvider
{
public:
    MapProvider() : QQuickImageProvider(QQuickImageProvider::Pixmap) {
        map.initMap();
    }

    QPixmap requestPixmap(const QString &id, QSize *size, const QSize &requestedSize);

    Client *getClient() const;
    void setClient(Client *value);    
private:
    Map map;
    Client *client;    

    int VIEW_WIDTH = 500;
    int VIEW_HEIGHT = 500;

    int SNAKE_INITIAL_SIZE = 17;
};

#endif // MAPPROVIDER_H
