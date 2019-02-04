#include "Bait.h"

Bait::Bait(QObject *parent) : QObject(parent)
{

}

QList<double> Bait::getX() const
{
    return x;
}

void Bait::setX(const QList<double> &value)
{
    x = value;
}

QList<double> Bait::getY() const
{
    return y;
}

void Bait::setY(const QList<double> &value)
{
    y = value;
}

QList<double> Bait::getSize() const
{
    return size;
}

void Bait::setSize(const QList<double> &value)
{
    size = value;
}

QList<QColor> Bait::getColor() const
{
    return color;
}

void Bait::setColor(const QList<QColor> &value)
{
    color = value;
}

void Bait::move()
{

}

void Bait::addBait(double x, double y, double size, QColor color)
{    
    this->x.append(x);
    this->y.append(y);
    this->size.append(size);    
    this->color.append(color);
    this->moveX.append(0);
    this->moveY.append(0);
}

void Bait::deleteBait(double x, double y)
{
    int n = this->x.length();
    for(int i = 0 ; i < n ; i++) {
        if((int)this->x.at(i) == (int)x && (int)this->y.at(i) == (int)y) {
            this->x.removeAt(i);
            this->y.removeAt(i);
            this->size.removeAt(i);
            this->color.removeAt(i);
            return;
        }
    }
}
