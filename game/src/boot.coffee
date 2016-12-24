
#    _                 _            ^ _____^
#   | |               | |           //-__O\\
#   | |__   ___   ___ | |_          ( (oo) )
#   | '_ \ / _ \ / _ \| __|
#   | |_) | (_) | (_) | |_
#   |_.__/ \___/ \___/ \__|       fc 2016-12-10
#


#Register Game
game = new Phacker.Game

game.setGameState YourGame

game.setSpecificAssets ->

# my parameters
    @_fle_ = 'specific asset'
    dsk = root_design + "desktop/desktop_gameplay/"
    mob = root_design + "mobile/mobile_gameplay/"
    aud = "products/tank-warrior/game/audio/"

    ld= @game.load

    #.----------.----------
    #images & sprites
    #.----------.----------

    if gameOptions.fullscreen # small width
        ld.image  'sky', mob + 'bg_gameplay.jpg'
    else # large width
        ld.image  'sky', dsk + 'bg_gameplay.jpg'

    # platform
    ld.image  'platform1',  dsk + 'platform/platform1.png'
    ld.image  'platform2',  dsk + 'platform/platform2.png'
    ld.image  'platform3',  dsk + 'platform/platform3.png'

    ld.spritesheet 'jmp_btn', dsk + 'jump_btn.png', 200, 57, 2
    # that's rambo the tank-warrior (rmb)
    ld.spritesheet 'rmb',     dsk + 'character_sprite/character_sprite.png', 35, 44, 4

    ld.spritesheet 'tank1',   dsk + 'danger/danger1.png', 68, 42, 4
    ld.spritesheet 'tank2',   dsk + 'danger/danger2.png', 68, 42, 4
    ld.spritesheet 'tank3',   dsk + 'danger/danger3.png', 68, 42, 4

    ld.spritesheet 'effect1',   dsk + 'effects/effect1.png', 86, 88, 3
    ld.spritesheet 'effect2',   dsk + 'effects/effect2.png', 86, 88, 3
    ld.spritesheet 'effect3',   dsk + 'effects/effect3.png', 86, 88, 3

    ld.audio 'bs_audio',       [ aud + 'bs.mp3', aud + 'bs.ogg' ]


    #.----------.----------
    #consts
    #.----------.----------

    @game.init =

        sky :       {y0 : 48} # bachground
        # rmb has jump so lower cam set in lower line
        cam_speed: 2.2 #  has to be  a 120 divider :1,2,3,4,5...

        jmp_btn :
            # location
            x0: (@game.width - 200) / 2
            y0: @game.height - 80
            # time (in ms) to hold button for hight jump
            hold: 300

        first_step:
            x0:  (@game.width - 312) / 2
            y0: @game.height - 125
            width: 312
            dy: 120  #dy between 2 stages

    @game.init.tank=
        width : 68
        height: 42
        minx  : @game.init.first_step.x0  - 35 # borders of stages, min & max
        maxx  : @game.init.first_step.x0 + @game.init.first_step.width - 30
        vx    : gameOptions.tank_vx # tank velocity
        # only for the first tank
        x0    : @game.init.first_step.x0 + @game.init.first_step.width *.75

    #player : rambo
    @game.init.rmb =
        vx          :  gameOptions.rambo_vx # initial velocity.x
        x0          :  @game.init.first_step.x0 # initial location
        y0          :  @game.init.first_step.y0 - 45
        height      :  42
        width       :  35
        gravity     :  200
        dragy       :  2
        #dx movements for rambo
        minx        : @game.init.first_step.x0 - 30 #30/2  borders of stages, min & max
        maxx        : @game.init.first_step.x0 + @game.init.first_step.width - 10
        has_crashed : false

    #Jump parameters
    @game.init.jump =
        low       : -135 # for a jump ( up = - )
        high      : -500 # hight jmp

    #.----------.----------
    # to be let    
    #.----------.----------

    game.setTextColorGameOverState 'white'
    game.setTextColorWinState 'white'
    game.setTextColorStatus 'orange'
    game.setOneTwoThreeColor 'white'

    game.setLoaderColor 0xffffff
    game.setTimerColor 0x60840A
    game.setTimerBgColor 0xffffff


@pauseGame = ->
    game.game.paused = true

@replayGame = ->
    game.game.paused = false

game.run();

