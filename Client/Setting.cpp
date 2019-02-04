#include "Setting.h"

Setting::Setting(QObject *parent) : QObject(parent)
{    
    CONFIG_FILE_CONTENT << "CONFIG_SERVER_IP=10.100.30.171";
    CONFIG_FILE_CONTENT << "CONFIG_SERVER_PORT=3000";
}

void Setting::readSetting() {
    if(!checkIfSettingFileExists())
        createSettingFile();
    QFile file(this->CONFIG_FILE_NAME);
    if(file.open(QIODevice::ReadOnly | QIODevice::Text)) {
        QTextStream reader(&file);
        while(reader.atEnd() == false) {
            QString str = reader.readLine();
            QStringList splitted = str.split("=");
            if(splitted.at(0) == "CONFIG_SERVER_IP")
                CONFIG_SERVER_IP = splitted.at(1);
            if(splitted.at(0) == "CONFIG_SERVER_PORT")
                CONFIG_SERVER_PORT = QString(splitted.at(1)).toInt();
        }
        file.close();
    } else
        qDebug() << "Error while opening file: " << file.errorString();
}

void Setting::createSettingFile() {
    QFile file(this->CONFIG_FILE_NAME);
    if(file.open(QIODevice::ReadWrite | QIODevice::Text)) {
        qDebug() << "Creating...";
        QTextStream writer(&file);
        foreach(QString str, this->CONFIG_FILE_CONTENT) {
            writer << str << endl;
        }
        file.close();
    } else
        qDebug() << "Open file error: " << file.errorString();
}

bool Setting::checkIfSettingFileExists() {
    QFile file(this->CONFIG_FILE_NAME);
    return file.exists();
}

QString Setting::getCONFIG_SERVER_IP() const
{
    return CONFIG_SERVER_IP;
}

void Setting::setCONFIG_SERVER_IP(const QString &value)
{
    CONFIG_SERVER_IP = value;
}

int Setting::getCONFIG_SERVER_PORT() const
{
    return CONFIG_SERVER_PORT;
}

void Setting::setCONFIG_SERVER_PORT(int value)
{
    CONFIG_SERVER_PORT = value;
}
