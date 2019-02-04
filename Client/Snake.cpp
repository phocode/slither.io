#include "Snake.h"

Snake::Snake(QObject *parent) : QObject(parent)
{

}

void Snake::push_node(double x, double y)
{
    this->x.append(x);
    this->y.append(y);
}

void Snake::update_head(double x, double y)
{            
    int n = this->x.length();    
    for(int i = n - 1 ; i >= 1 ; i--) {
        this->x.replace(i, this->x.at(i - 1));
        this->y.replace(i, this->y.at(i - 1));
    }
    this->x.replace(0, x);
    this->y.replace(0, y);    
}

void Snake::update_nodes(QList<double> x, QList<double> y)
{            
    this->x = x;
    this->y = y;
}

void Snake::grow()
{
    this->x.append(this->x.last());
    this->y.append(this->y.last());
}

QList<double> Snake::getX() const
{
    return x;
}

void Snake::setX(const QList<double> &value)
{
    x = value;
}

QList<double> Snake::getY() const
{
    return y;
}

void Snake::setY(const QList<double> &value)
{
    y = value;
}

QString Snake::getId() const
{
    return id;
}

void Snake::setId(const QString &value)
{
    id = value;
}

int Snake::getMaxLength() const
{
    return maxLength;
}

void Snake::setMaxLength(int value)
{
    maxLength = value;
}

void Snake::setName(const QString &value)
{
    name = value;
}

QString Snake::getName() const
{
    return name;
}
