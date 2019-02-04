#include "Logger.h"

Logger::Logger(QObject *parent) : QThread(parent)
{
    this->logFileName = "log.txt";
    if(checkIfLogFileExists())
        createLogFile();
}

Logger::Logger(QString fileName)
{
    this->logFileName = fileName;
}

void Logger::run() {    
    QFile file(this->logFileName);    
    if(file.size() > 200000) {
        file.open(QIODevice::ReadWrite | QIODevice::Text);
    }  else {
        file.open(QIODevice::ReadWrite | QIODevice::Text | QIODevice::Append);
    }

    QTextStream out(&file);
    out << "[" << QDate::currentDate().toString("dd/MM/yyyy") << " " << QTime::currentTime().toString("hh:mm:ss") << "]\t";
    out << content << endl;
    file.close();
}

void Logger::write(QString content) {
    if(checkIfLogFileExists()) {
        createLogFile();
    }

    QFile file(this->logFileName);
    if(file.open(QIODevice::ReadWrite | QIODevice::Text | QIODevice::Append)) {
        QTextStream out(&file);
        out << "[" << QDate::currentDate().toString("dd/MM/yyyy") << " " << QTime::currentTime().toString("hh:mm:ss") << "]\t";
        out << content << endl;
        file.close();
    }
}

bool Logger::createLogFile() {
    QFile file(this->logFileName);
    if(file.open(QIODevice::ReadWrite | QIODevice::Text | QIODevice::Append)) {
        file.close();
        return true;
    }
    return false;
}

bool Logger::checkIfLogFileExists() {
    QFile file(this->logFileName);
    return file.exists();
}

QString Logger::getContent() const
{
    return content;
}

void Logger::setContent(const QString &value)
{
    content = value;
}
