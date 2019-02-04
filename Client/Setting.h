#ifndef SETTING_H
#define SETTING_H

#include <QObject>
#include <QFile>
#include <QDebug>
#include <QTextStream>

class Setting : public QObject
{
    Q_OBJECT
public:
    explicit Setting(QObject *parent = 0);
    void readSetting();
    void createSettingFile();
    bool checkIfSettingFileExists();

    QString getCONFIG_SERVER_IP() const;
    void setCONFIG_SERVER_IP(const QString &value);

    int getCONFIG_SERVER_PORT() const;
    void setCONFIG_SERVER_PORT(int value);

signals:

public slots:    
private:
    QString CONFIG_FILE_NAME    = "config.txt";
    QStringList CONFIG_FILE_CONTENT;

    QString CONFIG_SERVER_IP;
    int     CONFIG_SERVER_PORT;
};

#endif // SETTING_H
