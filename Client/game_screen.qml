import QtQuick 2.0

import com.steinsvik.slitherio 1.0

Item {
    width: app.width
    height: app.height

    Canvas {
        id: game_canvas
        anchors.fill: parent

        onPaint: {            
            if(game_canvas.visible) {
                var id = this.width + "," + this.height + "," + Math.random();
                background.source = "image://MapProvider/" + id;                                                
            }            
        }

        Image {
            id: background
            anchors.fill: parent
        }
    }

    MouseArea {
        id: ma
        anchors.fill: parent
        hoverEnabled: true
        propagateComposedEvents: true
        onPressAndHold: {
            mouse.accepted = false;
            client.accelerate();
        }
        onReleased: {
            mouse.accepted = false;
            client.stopAccelerate();
        }
    }

    Text {
        id: game_info
        text: "Total player(s): " + client.totalPlayers();
    }

    Map { id: map }   

    Timer {
        id: game_loop
        interval: 1000/30
        running: true
        repeat: true
        onTriggered: {
            if(client.getInGame() === false) {
                game_screen.visible = false;
                menu_screen.visible = true;
            }

            //  Send mouse position
            client.sendData("2," +
                            ma.mouseX + "," +
                            ma.mouseY + "," +
                            parent.width + "," +
                            parent.height);
            game_canvas.requestPaint();

            //  Update current game info
            game_info.text = "Total player(s): " + client.totalPlayers();
        }
    }    
}
