#ifndef LOGGER_H
#define LOGGER_H

#include <QObject>
#include <QFile>
#include <QTextStream>
#include <QDate>
#include <QTime>
#include <QThread>

class Logger : public QThread
{
    Q_OBJECT
public:
    explicit Logger(QObject *parent = 0);
    Logger(QString);
    void run();
    void write(QString);
    bool createLogFile();
    bool checkIfLogFileExists();

    QString getContent() const;
    void setContent(const QString &value);

signals:

public slots:

private:
    QString logFileName;
    QString content;
};

#endif // LOGGER_H
