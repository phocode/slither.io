#ifndef BAIT_H
#define BAIT_H

#include <QObject>
#include <QColor>

class Bait : public QObject
{
    Q_OBJECT
public:
    explicit Bait(QObject *parent = 0);

    void addBait(double, double, double, QColor);
    void deleteBait(double, double);

    QList<double> getX() const;
    void setX(const QList<double> &value);

    QList<double> getY() const;
    void setY(const QList<double> &value);

    QList<double> getSize() const;
    void setSize(const QList<double> &value);    

    QList<QColor> getColor() const;
    void setColor(const QList<QColor> &value);

    void move();
signals:

public slots:

private:
    QList<int> id;
    QList<double> x;
    QList<double> y;
    QList<double> size;
    QList<QColor> color;
    QList<double> moveX;
    QList<double> moveY;

    double MOVE_X_MAX = 5;
    double MOVE_X_MIN = -5;
    double MOVE_Y_MAX = 5;
    double MOVE_Y_MIN = -5;
    double dx = 0.1;
    double dy = 0.1;
};

#endif // BAIT_H
