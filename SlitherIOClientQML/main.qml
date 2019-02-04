import QtQuick 2.5
import QtQuick.Controls 2.0
import QtQuick.Window 2.0

import com.steinsvik.slitherio 1.0

Window {    
    id: app
    width: 1280
    height: 720
    visible: true
    title: "Slither.io Client QML"

    Item {
        id: menu_screen
        visible: true
        Loader {
            source: "menu_screen.qml"
        }
    }

    Item {
        id: game_screen
        visible: false
        Loader {
            source: "game_screen.qml"
        }
    }

    Component.onDestruction: {        
        client.disconnect();
    }
}
