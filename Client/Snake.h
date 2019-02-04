#ifndef SNAKE_H
#define SNAKE_H

#include <QObject>
#include <QList>
#include <QDebug>
#include <cmath>

class Snake : public QObject
{
    Q_OBJECT
public:
    explicit Snake(QObject *parent = 0);

    void push_node(double, double);
    void update_head(double, double);
    void update_nodes(QList<double>, QList<double>);
    void grow();

    QList<double> getX() const;
    void setX(const QList<double> &value);

    QList<double> getY() const;
    void setY(const QList<double> &value);

    QString getId() const;
    void setId(const QString &value);

    int getMaxLength() const;
    void setMaxLength(int value);

    QString getName() const;
    void setName(const QString &value);

signals:

public slots:

private:
    QString id;
    QList<double> x;
    QList<double> y;
    QString name = "";
    int maxLength;
};

#endif // SNAKE_H
