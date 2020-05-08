// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import MainControl from "./MainControl";

const { ccclass, property } = cc._decorator;

export enum GameSatus {
    Game_Ready = 0,
    Game_Playing,
    Game_Over
}

// sound type enum
export enum SoundType {
    E_Sound_Fly = 0,
    E_Sound_Score,
    E_Sound_Die
}

@ccclass
export default class NewClass extends cc.Component {

    //Speed of bird
    speed: number = 0;

    // assign of main Control component
    mainControl: MainControl = null;

    onLoad() {
        cc.Canvas.instance.node.on( cc.Node.EventType.TOUCH_START, this.onTouchStart, this );
        this.mainControl = cc.Canvas.instance.node.getComponent( "MainControl" );
    }

    start() {

    }

    update( dt: number ) {

        if ( this.mainControl.gameStatus != GameSatus.Game_Playing )
        {
            return;
        }

        this.speed -= 0.05;
        this.node.y += this.speed;

        var angle = -( this.speed / 2 ) * 30;
        if ( angle >= 30 )
        {
            angle = 30;
        }
        this.node.rotation = angle;
    }

    onTouchStart( event: cc.Event.EventTouch ) {
        this.speed = 2;

        //play sound game over
        this.mainControl.audioSourceControl.playSound( SoundType.E_Sound_Fly ); 
    }

    onCollisionEnter( other: cc.Collider, self: cc.Collider ) {
        if ( other.tag === 0 )
        {
            cc.log( "game over" );
            this.mainControl.gameOver();
            this.speed = 0;
        }
        // collider tag is 1, that means the bird cross a pipe, then add score
        else if ( other.tag === 1 )
        {
            this.mainControl.gameScore++;
            this.mainControl.labelScore.string = this.mainControl.gameScore.toString();

            this.mainControl.audioSourceControl.playSound( SoundType.E_Sound_Score ); 
        }
    }
}
