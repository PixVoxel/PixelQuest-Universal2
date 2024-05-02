const playerResearchData = NBT.listTag();

ServerEvents.recipes(event => {
    event.shaped('8x kubejs:pixelquest_blueprint', [
        'AAA',
        'ABA',
        'AAA'
    ], {
        A: 'minecraft:paper',
        B: 'minecraft:blue_dye'
    })
    event.shaped('kubejs:pixelquest_research_table', [
        ' A ',
        ' B ',
        '   '
    ], {
        A: 'kubejs:pixelquest_blueprint',
        B: 'minecraft:lectern'
    })
})

ItemEvents.rightClicked('kubejs:pixelquest_research_blueprint', event => {
    event.player.swing('main_hand', true)
    let heldItem = event.player.getHeldItem('main_hand')

    if (event.target.block == 'kubejs:pixelquest_research_table') return

    if (event.hand != 'main_hand') return
    if (heldItem.getNbt()) {
        let researchTag = event.player.mainHandItem.getNbt()
        if (!researchTag.getString("ResearchName")) return
        let researchKey = "pixelquest.research." + researchTag.getString("ResearchName")
        event.player.tell(Text.translate("pixelquest.research.contain_research", Text.translate(researchKey)).blue())
        return
    }
})

BlockEvents.rightClicked('minecraft:lectern', event => {
    event.player.swing('main_hand', true)
    if (event.hand != 'main_hand') return
    let heldItem = event.player.getMainHandItem()
    if (heldItem.getId() == 'kubejs:pixelquest_blueprint') {
        event.block.set('kubejs:pixelquest_research_table', { facing: event.block.properties.facing })
        if (heldItem.count == 1) event.player.setMainHandItem('minecraft:air')
        else heldItem.count--
    }
})

BlockEvents.rightClicked('kubejs:pixelquest_research_table', event => {
    event.player.swing('main_hand', true)
    if (event.hand != 'main_hand') return
    let heldItem = event.player.getMainHandItem()
    let playerResearchName = playerResearchData[event.player.persistentData.ResearchIndex].researchName
    let playerResearchTime = playerResearchData[event.player.persistentData.ResearchIndex].researchTime

    if (heldItem.getId() == 'kubejs:pixelquest_research_blueprint') {

        if (!heldItem.hasNBT()) return;
        let researchTag = event.player.mainHandItem.getNbt()
        if (!researchTag.getString("ResearchName")) return
        let researchName = researchTag.getString("ResearchName")
        let researchTime = researchTag.getInt("ResearchTime")
        if (playerResearchName) {
            let researchKey = "pixelquest.research." + playerResearchName
            if (playerResearchTime >= 0) {
                event.player.tell(Text.translate("pixelquest.research.notification_warning_already_researching").red())
                event.player.tell(Text.translate("pixelquest.research.notification_now", Text.translate(researchKey)).red())
                let hourLeft = playerResearchTime / 3600
                let minuteLeft = playerResearchTime / 60 % 60
                let secondLeft = playerResearchTime % 60
                event.player.tell(Text.translate("pixelquest.research.notification_time_left", Math.floor(hourLeft).toFixed(0), Math.floor(minuteLeft).toFixed(0), Math.floor(secondLeft).toFixed(0)).red())
            }
            if (playerResearchTime == -1) {
                event.player.tell(Text.translate("pixelquest.research.notification_finish", Text.translate(researchKey)).blue())
                playerResearchName = ""
                playerResearchData[event.player.persistentData.ResearchIndex].researchName = playerResearchName
                return
            }
        }
        else {
            playerResearchName = researchName
            playerResearchTime = researchTime * event.player.persistentData.ResearchTimeModifier
            let researchKey = "pixelquest.research." + playerResearchName
            event.player.tell(Text.translate("pixelquest.research.notification_start", Text.translate(researchKey)).blue())
            let hourLeft = playerResearchTime / 3600
            let minuteLeft = playerResearchTime / 60 % 60
            let secondLeft = playerResearchTime % 60
            event.player.tell(Text.translate("pixelquest.research.notification_time_left", Math.floor(hourLeft).toFixed(0), Math.floor(minuteLeft).toFixed(0), Math.floor(secondLeft).toFixed(0)).blue())
            if (heldItem.count == 1) event.player.setMainHandItem('minecraft:air')
            else heldItem.count--
            playerResearchData[event.player.persistentData.ResearchIndex].researchName = playerResearchName
            playerResearchData[event.player.persistentData.ResearchIndex].researchTime = playerResearchTime
        }
        return
    }
    if (playerResearchName != "") {
        let researchKey = "pixelquest.research." + playerResearchName
        if (playerResearchTime == -1) {
            event.player.tell(Text.translate("pixelquest.research.notification_finish", Text.translate(researchKey)).blue())
            playerResearchName = ""
            playerResearchData[event.player.persistentData.ResearchIndex].researchName = playerResearchName
            return
        }
        event.player.tell(Text.translate("pixelquest.research.notification_now", Text.translate(researchKey)).blue())
        let hourLeft = playerResearchTime / 3600
        let minuteLeft = playerResearchTime / 60 % 60
        let secondLeft = playerResearchTime % 60
        event.player.tell(Text.translate("pixelquest.research.notification_time_left", Math.floor(hourLeft).toFixed(0), Math.floor(minuteLeft).toFixed(0), Math.floor(secondLeft).toFixed(0)).blue())
        return;
    }
    event.player.tell(Text.translate("pixelquest.research.notification_no_research").blue())
})

PlayerEvents.loggedIn(event => {
    if (!event.player.persistentData.FirstJoin) {
        let research = {
            uuid: event.player.stringUuid,
            researchName: '',
            researchType: '',
            researchTime: 0
        }
        playerResearchData.push(research)
        event.player.persistentData.ResearchIndex = playerResearchData.length - 1

        event.player.persistentData.FirstJoin = true
    }
    if (!event.player.persistentData.ResearchTimeModifier) event.player.persistentData.ResearchTimeModifier = 1
    let rName = playerResearchData[event.player.persistentData.ResearchIndex].researchName
    let rTime = playerResearchData[event.player.persistentData.ResearchIndex].researchTime
    if (rName && rTime == -1) event.player.tell(Text.translate("pixelquest.research.notification_sleep_end"))
})

ServerEvents.loaded(event => {
    if (event.server.persistentData.UserResearchData) {
        for (let i = 0; i < event.server.persistentData.UserResearchData.length; i++) {
            playerResearchData.push(event.server.persistentData.UserResearchData[i])
        }
    }
})

ServerEvents.tick(event => {
    if (event.server.getTickCount() % 20 == 0) {
        for (let i = 0; i < playerResearchData.length; i++) {
            let rName = playerResearchData[i].researchName
            let rTime = playerResearchData[i].researchTime
            let player = event.server.getPlayerList().getPlayer(playerResearchData[i].uuid)

            if (!rName) continue;
            if (rTime == -1) continue;
            if (rTime > 0) {
                rTime--
            }
            if (rTime == 0) {
                rTime = -1
                if (player) player.tell(Text.translate("pixelquest.research.notification_end"))
            }
            playerResearchData[i].researchTime = rTime
        }
    }
})

ServerEvents.unloaded(event => {
    if (playerResearchData) {
        event.server.persistentData.UserResearchData = playerResearchData
    }
})