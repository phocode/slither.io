#include "Map.h"

Map::Map(QObject *parent) : QObject(parent)
{    
//    map = QPixmap(this->WIDTH, this->HEIGHT);
    map = QPixmap(this->BORDER_WIDTH, this->BORDER_HEIGHT);
    initMap();
}

void Map::initMap() {    
    QPainter qp(&map);

    //  Draw background
    qp.setBrush(QBrush("#841501"));                     //  red
    qp.drawRect(0,
                0,
                this->BORDER_WIDTH,
                this->BORDER_HEIGHT);

    int numOfRect = WIDTH / RECT_SIZE;
    int offset_x = (BORDER_WIDTH - (WIDTH + numOfRect * this->RECT_SPACE)) / 2;
    int offset_y = (BORDER_HEIGHT - (WIDTH + numOfRect * this->RECT_SPACE)) / 2;
    qp.setBrush(QBrush("#4e514f"));                     //  black
    qp.drawRect(offset_x,
                offset_y,
                WIDTH + (numOfRect * RECT_SPACE),
                HEIGHT + (numOfRect * RECT_SPACE));

    qp.setBrush(QBrush("#8c938e"));                     //  blue
    for(int i = 0 ; i < numOfRect; i++) {
        for(int j = 0 ; j < numOfRect ; j++) {
            qp.drawRect((i * RECT_SIZE + i * RECT_SPACE) + offset_x,
                        (j * RECT_SIZE + j * RECT_SPACE) + offset_y,
                        RECT_SIZE,
                        RECT_SIZE);
        }
    }
}

QPixmap Map::getMap() {
    return QPixmap(this->map);
}

QPixmap Map::getMap(int x, int y, int width, int height) {
    return QPixmap(this->map.copy(x, y, width, height));
}

QImage Map::getMapImg()
{
    return this->map.toImage();
}

QImage Map::getMapImg(int x, int y, int width, int height)
{
    return this->map.copy(x, y, width, height).toImage();
}

int Map::getWIDTH() const
{
    return WIDTH;
}

void Map::setWIDTH(int value)
{
    WIDTH = value;
}

int Map::getHEIGHT() const
{
    return HEIGHT;
}

void Map::setHEIGHT(int value)
{
    HEIGHT = value;
}

int Map::getRECT_SPACE() const
{
    return RECT_SPACE;
}

void Map::setRECT_SPACE(int value)
{
    RECT_SPACE = value;
}
