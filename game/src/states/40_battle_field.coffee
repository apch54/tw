# ecrit par fc le 07-12-2016



class  Phacker.Game.Battle_field

    constructor : (game, init) ->
        @gm     = game
        @init   = init
        @stages = []

        for i in [0..2]
            @stages. push new Phacker.Game.Step @gm, @init, i
        console.log "- #{@_fle_} : ",@stages
        return