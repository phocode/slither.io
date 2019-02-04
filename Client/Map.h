#ifndef MAP_H
#define MAP_H

#include <QObject>
#include <QDebug>
#include <QPixmap>
#include <QImage>
#include <QPainter>
#include <QQuickImageProvider>

class Map : public QObject
{
    Q_OBJECT
public:
    explicit Map(QObject *parent = 0);

    void initMap();
    Q_INVOKABLE QPixmap getMap();
    Q_INVOKABLE QPixmap getMap(int, int, int, int);
    Q_INVOKABLE QImage getMapImg();
    Q_INVOKABLE QImage getMapImg(int, int, int, int);

    int getWIDTH() const;
    void setWIDTH(int value);

    int getHEIGHT() const;
    void setHEIGHT(int value);

    int getRECT_SPACE() const;
    void setRECT_SPACE(int value);

signals:

public slots:

private:
    QPixmap map;
    QPixmap view_map;

    int WIDTH = 2000;
    int HEIGHT = 2000;

    int BORDER_WIDTH = 4000;
    int BORDER_HEIGHT = 4000;

    int RECT_SIZE = 50;
    int RECT_OFFSET = 10;
    int RECT_SPACE = 10;
};

#endif // MAP_H
