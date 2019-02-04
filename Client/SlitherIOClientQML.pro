TEMPLATE = app

QT += qml quick network core
CONFIG += c++11
SOURCES += main.cpp \
    Client.cpp \
    Snake.cpp \
    Map.cpp \
    MapProvider.cpp \
    Bait.cpp \
    Setting.cpp \
    Logger.cpp

RESOURCES += \
    qrc.qrc

# Additional import path used to resolve QML modules in Qt Creator's code model
QML_IMPORT_PATH =

# Default rules for deployment.
include(deployment.pri)

HEADERS += \
    Client.h \
    Snake.h \
    Map.h \
    MapProvider.h \
    Bait.h \
    Setting.h \
    Logger.h

DISTFILES +=
