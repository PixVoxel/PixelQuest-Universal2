StartupEvents.registry('creative_mode_tab', event => {
    event.create('pixelquest_blueprint_research')
    .displayName(Text.translate('group.pixelquest.blueprint_research'))
    .icon(() => 'kubejs:pixelquest_blueprint')
    .content(() => [
        'kubejs:pixelquest_blueprint',
        'kubejs:pixelquest_research_table'
    ])
})

StartupEvents.modifyCreativeTab('kubejs:tab', event => {
    event.remove('kubejs:pixelquest_blueprint')
    event.remove('kubejs:pixelquest_research_blueprint')
    event.remove('kubejs:pixelquest_research_table')
})