#include "MapProvider.h"

QPixmap MapProvider::requestPixmap(const QString &id, QSize *size, const QSize &requestedSize)
{        
    if(this->client->getSnake()->getX().length() == 0) {
        return QPixmap();
    }

    Snake *snake = client->getSnake();
    QStringList params = id.split(",");        

    if(snake == NULL) {        
        return QPixmap();
    } else { //  Draw environment

        //  Preparations
        QList<double> x = snake->getX();
        QList<double> y = snake->getY();
        QRect camera(x.at(0) - this->VIEW_WIDTH / 2,
                     y.at(0) - this->VIEW_HEIGHT / 2,
                     this->VIEW_WIDTH,
                     this->VIEW_HEIGHT);

        //  Get the map
        QPixmap view_map = map.getMap(x.at(0) - this->VIEW_WIDTH / 2,
                                      y.at(0) - this->VIEW_HEIGHT / 2,
                                      this->VIEW_WIDTH,
                                      this->VIEW_HEIGHT);
        QPainter qp(&view_map);

        //   Draw baits
        Bait *bait = client->getBait();
        int n = bait->getX().size();

        QList<double> baitX = bait->getX();
        QList<double> baitY = bait->getY();
        QList<double> baitSize = bait->getSize();
        QList<QColor> colors = bait->getColor();
        double bx, by, bs;
        QColor color;
        qp.setBrush(QBrush("#79f293"));        
        for(int i = 0 ; i < n ; i++) {
            bx = baitX.at(i);
            by = baitY.at(i);
            bs = baitSize.at(i);
            color = colors.at(i);
            qp.setBrush(QBrush(color));
            //if(camera.contains(QRect(bx - baitSize.at(i) / 2,
            //                         by - baitSize.at(i) / 2,
            //                         bs,
            //                         bs)) == false) continue;
            qp.drawEllipse(bx - camera.x(),
                           by - camera.y(),
                           bs,
                           bs);

        }

        //  Draw player's snake
        qp.setBrush(QBrush("#effff2"));
        QList<double> xdraw;
        QList<double> ydraw;
        double x0 = view_map.width() / 2 - this->SNAKE_INITIAL_SIZE / 2;
        double y0 = view_map.height() / 2 - this->SNAKE_INITIAL_SIZE / 2;
        xdraw.append(x0);
        ydraw.append(y0);
        double preX = x0;
        double preY = y0;
        n = x.length();        
        double dx = 0;
        double dy = 0;
        for(int i = 1 ; i < n ; i++) {
            dx = x.at(i) - x.at(i - 1);
            dy = y.at(i) - y.at(i - 1);
            xdraw.append(preX + dx);
            ydraw.append(preY + dy);
            preX += dx; preY += dy;
        }
        for(int i = n - 1 ; i >= 0 ; i--) {
            if(i % 2) qp.setBrush(QBrush("#bec0c4"));
            else qp.setBrush(QBrush("#efefef"));
            qp.drawEllipse(xdraw.at(i), ydraw.at(i),
                           this->SNAKE_INITIAL_SIZE, this->SNAKE_INITIAL_SIZE);

            //  Draw player's name
            if(i == 0) {
                qp.drawText(xdraw.at(i), ydraw.at(i), snake->getName());
            }
        }        

        //  Draw enemies;
        QList<Snake*> enemies = client->getEnemies();
        n = enemies.length();
        for(int i = 0 ; i < n ; i++) {      //  loop through enemies
            Snake *enemy = enemies.at(i);            
            xdraw.clear(); ydraw.clear();
            QList<double> ex = enemy->getX();
            QList<double> ey = enemy->getY();
            int m = ex.length();            
            for(int j = 0 ; j < m ; j++) {                                
                xdraw.append(ex.at(j) - camera.x());
                ydraw.append(ey.at(j) - camera.y());
            }
            int nn = xdraw.length();
            //  draw all nodes that have been checked intersected or inside
            //  the camera
            for(int k = nn - 1 ; k >= 0 ; k--) {
                if(k % 2) qp.setBrush(QBrush("#bec0c4"));
                else qp.setBrush(QBrush("#efefef"));                
                qp.drawEllipse(xdraw.at(k), ydraw.at(k), this->SNAKE_INITIAL_SIZE, this->SNAKE_INITIAL_SIZE);

                //  Draw enemy's name
                if(k == 0) {
                    qp.drawText(xdraw.at(k), ydraw.at(k), enemy->getName());
                }
            }
        }
        return view_map;
    }
}

Client *MapProvider::getClient() const
{
    return client;
}

void MapProvider::setClient(Client *value)
{
    client = value;
}
