import QtQuick 2.0
import QtQuick.Controls 2.0

Item {    
    width: app.width
    height: app.height
    property var button_text_size: 10    

    Text {
        id: title
        text: "Slither.io"
        font.pointSize: 30
        anchors.horizontalCenter: playBtn.horizontalCenter
        anchors.bottom: notificator.top
        anchors.bottomMargin: 50
    }

    Text {
        id: notificator
        text: ""
        font.pointSize: 10
        anchors.horizontalCenter: playBtn.horizontalCenter
        anchors.bottom: nameTextField.top
        anchors.bottomMargin: 10
//        anchors.top: title.bottom
//        anchors.topMargin: 10
        onVisibleChanged: {
            text = client.getNotificationText();
        }
    }

    TextField {
        id: nameTextField
        placeholderText: "Enter your name"
        anchors.bottom: playBtn.top
        anchors.horizontalCenter: playBtn.horizontalCenter
        anchors.bottomMargin: 10
    }

    Button {
        id: playBtn
        text: "Play"
        anchors.centerIn: parent
        font.pointSize: button_text_size
        onClicked: {
            client.connect("10.100.30.171", 3000);  // local server
            client.setInGame(true);
            client.setSnakeName(nameTextField.text);
            client.sendData("9," + nameTextField.text + ",");
            menu_screen.visible = false;
            game_screen.visible = true;
        }
    }

    Button {
        id: quitBtn
        text: "Quit"
        anchors.top: playBtn.bottom
        anchors.topMargin: 15
        anchors.horizontalCenter: playBtn.horizontalCenter
        font.pointSize: button_text_size
        onClicked: {
            app.close();
            //client.disconnect();
        }
    }
}
