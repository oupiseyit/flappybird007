// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

import AudioSourceControl from "./AudioSourceControl";

export enum GameSatus{
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

    @property( cc.Sprite )
    spBg: cc.Sprite[] = [null, null];

    @property( cc.Prefab )
    pipePrefab: cc.Prefab = null;

    pipe: cc.Node[] = [null, null, null]

    @property( cc.Sprite )
    spGameOver: cc.Sprite;

    //Start button
    btnStart: cc.Button = null;

    //game state
    gameStatus: GameSatus = GameSatus.Game_Ready;

    @property( cc.Label )
    labelScore: cc.Label = null;

    //recode score
    gameScore: number = 0;

    @property( AudioSourceControl )
    audioSourceControl: AudioSourceControl = null;
        
    // LIFE-CYCLE CALLBACKS:

    onLoad() {

        // open Collision System
        var collisionManager = cc.director.getCollisionManager();
        collisionManager.enabled = true;
        // open debug draw when you debug the game
        // do not forget to close when you ship the game
        collisionManager.enabledDebugDraw = false;
        // find the GameOver node, and set active property to false
        this.spGameOver = this.node.getChildByName( "GameOver" ).getComponent( cc.Sprite );
        this.spGameOver.node.active = false;

        //find the start button
        this.btnStart = this.node.getChildByName( "BtnStart" ).getComponent( cc.Button );

        //register click callback
        this.btnStart.node.on( cc.Node.EventType.TOUCH_END, this.touchStartBtn, this );
    }

    start() {
        for ( let i = 0; i < this.pipe.length; i++ )
        {
            this.pipe[i] = cc.instantiate( this.pipePrefab );
            this.node.getChildByName( "Pipe" ).addChild( this.pipe[i] );

            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * ( maxY - minY );
        }

    }

    update( dt: number ) {
        if (this.gameStatus != GameSatus.Game_Playing){
            return;
        }

        // move the background node
        for ( let i = 0; i < this.spBg.length; i++ )
        {
            this.spBg[i].node.x -= 1.0;
            if ( this.spBg[i].node.x <= -288 )
            {
                this.spBg[i].node.x = 288;
            }
        }

        // move pipes
        for ( let i = 0; i < this.pipe.length; i++ )
        {
            this.pipe[i].x -= 1.0;
            if ( this.pipe[i].x <= -170 )
            {
                this.pipe[i].x = 430;

                var minY = -120;
                var maxY = 120;
                this.pipe[i].y = minY + Math.random() * ( maxY - minY );
            }
        }

    }

    gameOver() {
        this.spGameOver.node.active = true;

        //when game is over show button start
        this.btnStart.node.active = true;

        //set game status to Game ovber
        this.gameStatus = GameSatus.Game_Over;

        //play sound game over
        this.audioSourceControl.playSound( SoundType.E_Sound_Die );


    }

    touchStartBtn() {
        //hide start button
        this.btnStart.node.active = false;

        //set game status to playing
        this.gameStatus = GameSatus.Game_Playing;

        //hide Game node
        this.spGameOver.node.active = false;

        //reset position of all the pipes
        for (let i = 0; i < this.pipe.length; i++) {
            this.pipe[i].x = 170 + 200 * i;
            var minY = -120;
            var maxY = 120;
            this.pipe[i].y = minY + Math.random() * ( maxY - minY );
        }

        // reset angle and position of the bird
        var bird = this.node.getChildByName( 'Bird' );
        bird.y = 0;
        bird.rotation = 0

        //reset score when restart game
        this.gameScore = 0;
        this.labelScore.string = this.gameScore.toString();
    }



}
