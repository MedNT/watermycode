const { hydrationLeveles, hydrationTypes } = require('./statics');

/**
 * Getting the coresponding text message & tooltip 
 * For each level of hysration or dehydration
 * @param {string} type
 * @param {string} level
 * @returns {object} : {text: string, tooltip: string}
 */
function getHydrationMsg(type, level) {
    switch (type) {
        // hydration level messages
        case hydrationTypes.hydration: {
            if(level === hydrationLeveles.low) return {
                text: "💧 Hydration Power Boost 🚀",
                tooltip: "Supercharged! You're coding with hydration powers now!"
            };
            else if(level === hydrationLeveles.minimum) return {
                text: "💧 Hydrated Warrior ⚔️",
                tooltip: "Stealthy hydration! You're unstoppable now!"
            };
            else if(level === hydrationLeveles.medium) return {
                text: "💧 Code Fuelled by Water 💪",
                tooltip: "You're coding like a pro with that water boost!"
            };
            return {
                text: "💧 Water Champion 🏆",
                tooltip: "You're crushing it! Stay refreshed and keep coding!"
            };
        }
        // dehydration level messages
        case hydrationTypes.dehydration: {
            if(level === hydrationLeveles.low) return {
                text: "💧 Hydration Alert 🚨",
                tooltip: "Don't forget! A hydrated coder is a happy coder!"
            };
            else if(level === hydrationLeveles.minimum) return {
                text: "💧 Drink Water, Code Better 💡",
                tooltip: "Your brain is asking for a water break!"
            };
            else if(level === hydrationLeveles.medium) return {
                text: "💧 Hydration Timeout ⏳",
                tooltip: "Take a quick sip and get back to coding greatness!"
            };
            return {
                text: "💧 Water Needed ASAP ⚡",
                tooltip: "Your hydration levels are low. Time for a refresh!"
            };
        }
        // default break (optional)
        default:
            break;
    }
}

module.exports = { getHydrationMsg };