export const classes = [
  { code: "A", tone: 1, text: "1-day suspension or a written warning." },
  { code: "B", tone: 2, text: "3-day suspension or a written warning." },
  { code: "C", tone: 2, text: "5-day suspension or a written warning." },
  { code: "D", tone: 3, text: "7-day suspension." },
  { code: "E", tone: 3, text: "14-day suspension." },
  { code: "F", tone: 4, text: "Appealable but permanent suspension." },
];

export const special = [
  { code: "CR", name: "Community Removal", text: "Issued to a player who has shown themselves to be a repeat offender. An indefinite removal from the community." },
  { code: "CD", name: "Character Deletion", text: "Issued when activities have given a character unintended advantages, such as items or money. One or more characters are deleted to protect the economy and the server experience." },
  { code: "GB", name: "Government Blacklist", text: "Issued for extreme misconduct or corruption in the government sector. A permanent, unappealable blacklist from all government-funded jobs: law enforcement, judicial and emergency services." },
  { code: "SI", name: "Specialized Instances", text: "Issued situationally for things like currency trading, or repeated infractions inside and outside the server that have a moderate to major impact on another community member. Justifies a suspension of 31 days or more." },
];

export const finalPolicy =
  "The final infraction policy deals with individuals who repeat the same infraction, regardless of classification or type, to the point that more action is needed. It exists to deter repeat offenders and to remove players who show repeated malice. Anyone who goes past the maximum infraction category for one rule will be issued a Community Removal (CR).";

export const basics = [
  "Must be at least 16 years of age.",
  "Own a legal copy of Grand Theft Auto V.",
  "Must have a working microphone.",
  "Must be able to speak English.",
];

export const sections = [
  {
    n: 3, title: "Conduct & Behavior", rules: [
      { id: "3.1", t: "Breaking Character", p: "A-F", d: "Players are expected to remain in character (IC) during roleplay interactions. Breaking character, using out-of-character (OOC) information to influence actions, or making repeated references to real-life information during scenes is prohibited. This ensures immersion for all participants.",
        ex: ["“BRB, gotta step away from my PC.”", "“I need to go talk to the angels.”", "“I’m gonna report you.”", "“Yo, don’t rob me, I’m talking with staff.”"] },
      { id: "3.2", t: "Discriminatory Behavior", p: "F-CR", d: "Any actions, comments, or roleplay that target others based on race, gender, sexuality, religion, disability, or other protected traits are strictly forbidden. Discriminatory behavior, whether IC or OOC, is treated as extremely severe and may result in a permanent removal (CR)." },
    ],
  },
  {
    n: 4, title: "Disruptive & Inappropriate Conduct", rules: [
      { id: "4.1", t: "Griefing & Unwarranted Interactions", p: "D-F", d: "Players must engage in roleplay in a meaningful and respectful manner. Griefing, which includes intentionally disrupting other players’ roleplay without justification, is prohibited. Unwarranted interactions that force others into unwanted situations, harassment, or constant interference fall under this rule.",
        ex: ["Continuously attacking or harassing the same player without RP reason.", "Stalking someone in-game with the intention to annoy rather than RP.", "Blocking entrances, preventing players from completing job or scene interactions."],
        ok: ["Engaging in conflict or confrontation with clear IC justification.", "Interacting with players during consensual or story-driven events."] },
      { id: "4.2", t: "Conduct Intended to Evade or Provoke Enforcement", p: "D-F", d: "Players may not intentionally provoke, manipulate, or avoid server enforcement (law enforcement, EMS, staff) for personal gain. Attempts to exploit or bait staff actions, or evade consequences of IC actions through rule manipulation, are prohibited.",
        ex: ["Threatening staff or attempting to manipulate a staff member’s decision.", "Baiting people into rulebreaks just to report them."] },
      { id: "4.3", t: "Excessive Toxicity", p: "D-F", d: "Toxic behavior that negatively impacts the community or roleplay environment is prohibited. Excessive toxicity includes repeated verbal harassment, intimidation, or intentionally ruining others’ roleplay experience. This applies to both IC and OOC when it affects other players.",
        ex: ["Mag dumping someone who is already downed.", "Stealing someone’s car and driving it into a gas pump.", "Camping bodies."] },
    ],
  },
  {
    n: 5, title: "Inappropriate Character Behavior", rules: [
      { id: "5.1", t: "Character Blending", p: "C-F+CD", d: "Players must maintain clear separation between characters to avoid unfair advantages. Blending multiple characters to gain items, information, or influence is prohibited. This ensures a fair and immersive RP environment." },
      { id: "5.2", t: "Low Effort & No Intent", p: "F-CR", d: "Players must actively participate in meaningful roleplay. Actions that indicate no effort or intent, such as ignoring a scene, random behavior, or disruptive inactivity, are prohibited. This rule ensures all players contribute to the story and community immersion.",
        ex: ["Creating a character with only the intent to disrupt roleplay or troll."] },
      { id: "5.3", t: "Value of Life", p: "D-F", d: "Players must treat life as valuable. Unnecessary deaths or reckless behavior that disregards RP consequences are prohibited. Life should carry weight in interactions to maintain realism and immersion.",
        ex: ["Ignoring threats or RP situations that should logically impact character safety.", "Pulling out a weapon when someone already has a gun pointed at you.", "Running away from someone who is pointing a weapon at you.", "Trying to fight back when you are clearly outnumbered."] },
      { id: "5.4", t: "Injury RP", p: "A-C", d: "Players must RP out their injuries sustained during interactions. Ignoring injuries and acting like nothing happened is not allowed.",
        ex: ["Continuing to run or fight without IC explanation after being shot or injured.", "Pretending to be unharmed after a serious accident or assault."],
        ok: ["Using emotes, animations, or dialogue to demonstrate injuries (/me).", "Seeking medical attention IC when appropriate."] },
      { id: "5.5", t: "New Life Rule", p: "A-D", d: "When a character dies and chooses to respawn, previous interactions, knowledge, and events that immediately led to the death are considered void and should be forgotten. The only time this does not apply is if someone tells your character what happened." },
      { id: "5.6", t: "Return to Scene", p: "A-D", d: "Players must avoid re-entering a hostile scene or location after leaving or being downed unless there is IC justification. Returning purely to disrupt, exploit, or harass others is prohibited. You may only return once the area is clear or the scene has ended.",
        ex: ["Coming back to a bank robbery scene after leaving just to troll the cops.", "Re-entering a shootout after being downed."] },
    ],
  },
  {
    n: 6, title: "Protected Services", rules: [
      { id: "6.1", t: "Improper Interference with Law Enforcement", p: "C-F", d: "Players must respect law enforcement IC and avoid maliciously disrupting their actions. Harassment, baiting, or provoking law enforcement without a valid IC reason is prohibited.",
        ex: ["Luring police into an ambush.", "Continuously bothering officers during investigations.", "Engaging in unnecessary violence against police outside of justified scenarios.", "Purposefully speeding past officers just to get pulled over."] },
      { id: "6.2", t: "Prohibited Robbery of Government Official", p: "E-F", d: "While robbing police isn’t against the rules, players must have a valid RP reason to do so. Simply robbing an officer just for the fun of it is strictly prohibited. In addition, you may not “pocket wipe” an officer." },
      { id: "6.3", t: "Protection of EMS & Fire Personnel", p: "C-F", d: "EMS and Fire personnel are crucial for roleplay. Players may not engage on-duty EMS or Fire staff with violence, suggest they clock out to avoid treatment, or hinder their function unnecessarily.",
        ex: ["Shooting at EMS/Fire personnel without IC reason.", "Preventing EMS or Fire personnel from reaching injured characters for personal gain.", "Forcing EMS or Fire personnel to act outside of their normal IC duties without RP justification."] },
      { id: "6.4", t: "Abuse of Government Authority", p: "F+GB", d: "Government employees must not abuse powers, tools, or features for personal gain or to harm others. This includes leaking confidential information, purposefully distributing equipment, or exploiting IC authority.",
        ex: ["Using police or EMS tools to steal or manipulate others outside IC necessity.", "Sharing confidential government documents with other characters.", "Distributing equipment to other characters."] },
      { id: "6.5", t: "Unauthorized Government Impersonation", p: "C-E", d: "Players may not pretend to be government employees or represent government agencies without proper IC reasoning or staff approval. This includes uniforms and other indicators of authority. If you want to see if you’re allowed to do so for a scene, ask staff." },
    ],
  },
  {
    n: 7, title: "Robbery Conduct & Scene Participation", rules: [
      { id: "7.1", t: "Group Roaming & Engagement Limits", p: "A-D", d: "Players may only roam in groups of 8 at any given time. This is to maintain balanced RP. Exceeding these limits, especially during interactions with law enforcement, is prohibited. For crew and gang limitations, refer to the Crew Guidelines." },
      { id: "7.2", t: "Unauthorized Scene Interference", p: "C-F", d: "Players must not disrupt scenes that they are not involved in without IC justification. Malicious interference for amusement or advantage is prohibited.",
        ex: ["Interrupting a heist or robbery when police are on scene or a hostage is already placed on scene.", "Interrupting a traffic stop just to start drama."] },
      { id: "7.3", t: "Criminal Event Cooldowns", p: "A-D", d: "After participating in a heist or criminal event, players must observe cooldowns before initiating or participating in another to prevent excessive repetition and maintain RP balance. Cooldown times are still being finalized.", tbd: true },
      { id: "7.4", t: "Hostage Use & Limitations", p: "A-E", d: "Hostages are meant to provide leverage in RP. Mishandling, harming unnecessarily, or exceeding 45 minutes (unless consent is provided or law enforcement is on scene) is forbidden. Hostages cannot be friends." },
      { id: "7.5", t: "Improper & Low Effort Robberies", p: "A-E", d: "Robberies must be initiated properly and provide meaningful RP. Low-effort interactions or immediate, one-sided thefts are prohibited.",
        ex: ["Running up to a player and yelling “you’re being robbed, put your hands up” with no IC justification.", "Not allowing the person being robbed to provide reasonable counter RP."] },
      { id: "7.6", t: "Predatory Robbery & Location Camping", p: "A-F", d: "Camping locations with the intent to rob or exploit choke points for easy theft is prohibited. Players must avoid low-effort attacks that give minimal counterplay.",
        ex: ["Waiting at a known heist location to ambush other players.", "Waiting outside a gun store to rob the person of their weapons."] },
    ],
  },
  {
    n: 8, title: "Roleplay Integrity & Prohibited Conduct", rules: [
      { id: "8.1", t: "Low Effort & Bad Faith Scamming", p: "A-F", d: "Scams must involve meaningful RP and allow for counterplay. Low-effort scams or ones targeting new players without proper engagement are prohibited.",
        ex: ["Taking the item and running away without any further RP.", "Taking the money, not giving the item, and running away with no further RP.", "Forcing someone or a new player to retrieve money from the ATM."] },
      { id: "8.2", t: "Real-World Trading", p: "SI+CD", d: "Exchanging in-game items, currency, or benefits for real-world money or goods, and vice versa, is strictly prohibited.",
        ex: ["Selling your character’s money for real cash on Discord.", "Purchasing a car or weapons from someone IC with real cash OOC."] },
      { id: "8.3", t: "Metagaming", p: "C-F", d: "Using information obtained outside of RP to influence IC actions is prohibited. This includes OOC knowledge from Discord, Twitch, or prior characters." },
      { id: "8.4", t: "Powergaming", p: "C-E", d: "Players may not force RP outcomes, abuse features, or act beyond their character’s abilities to gain advantage.",
        ex: ["Using animations to avoid injuries.", "Carrying or escorting someone to bypass mechanics.", "Storing vehicles mid-pursuit to avoid loss.", "Running into your house mid-pursuit to prevent capture.", "Ocean dumping your vehicle mid-pursuit.", "Respawning when down to avoid arrest."] },
      { id: "8.5", t: "Combat Logging", p: "D-F", d: "Disconnecting during active scenes to avoid consequences is prohibited. If it is an emergency, you must contact staff. Habitual emergencies will result in a permanent ban." },
      { id: "8.6", t: "Exploit Abuse", p: "F-CD", d: "Using bugs, unintended features, or automation tools for advantage is prohibited. Players must report discovered exploits immediately." },
      { id: "8.7", t: "Cheating & Modding", p: "CR", d: "Any external software or modification (including texture packs) that gives players an unfair advantage is strictly prohibited. If you are unsure whether your texture pack is acceptable, ask staff before using it." },
      { id: "8.8", t: "Ban Evasion", p: "CR", d: "Circumventing a ban or infraction through alternate accounts is strictly forbidden. Don’t do it. We will find you. We will ban every IP address you own." },
      { id: "8.9", t: "Petty Reporting", p: "A-F", d: "Filing reports for revenge or trivial matters that do not impact RP or server rules is prohibited. Let’s be adults." },
    ],
  },
  {
    n: 9, title: "Server Restart & Cooldown Conduct", rules: [
      { id: "9.1", t: "Pre-Restart Restrictions", p: "A-D", d: "During the 30 minutes before a restart, players should not engage in illegal activities. If you started something before the 30 minutes, complete it as soon as possible. This includes selling drugs, robbing stores, houses, other players, etc." },
      { id: "9.2", t: "Post-Restart Restrictions", p: "A-D", d: "During the 30 minutes after a restart, players should not engage in illegal activities. This includes selling drugs, robbing stores, houses, other players, etc." },
    ],
  },
  {
    n: 10, title: "Prohibited Hostile Conduct", rules: [
      { id: "10.1", t: "VDM: Vehicle Death Match", p: "B-E", d: "Players may not intentionally use vehicles to harm or kill others without proper RP context. Vehicles are for transportation, racing, or tactical movement, not weapons.",
        ex: ["Running over players to kill them outside of justified RP scenarios.", "Ramming other players’ vehicles to force an injury or to “kill the car.”"] },
      { id: "10.2", t: "RDM: Random Death Match", p: "B-E", d: "Players may not attack or kill others without proper reasoning and proper initiation. Random violence breaks immersion and is prohibited.",
        ex: ["Shooting a player on the street for no reason.", "Killing someone without interaction or provocation IC."],
        ok: ["Engaging in combat with proper justification or RP setup.", "Using violence as a last resort after proper escalation and warnings."] },
    ],
  },
  {
    n: 11, title: "Employment & Job Integrity", rules: [
      { id: "11.1", t: "Job Abuse & Exploitative Job Conduct", p: "E-F", d: "Players may not exploit jobs, unintended features, or mechanics for personal gain at the expense of others or their business.",
        ex: ["Maliciously stealing from a business you work at to bankrupt it.", "Having access to the business bank account and draining it before quitting."] },
    ],
  },
  {
    n: 12, title: "Green Zones", rules: [
      { id: "12.1", t: "Protected Areas & Neutral Ground Conduct", p: "A-E", d: "Green Zones are neutral areas where hostile, criminal, or business interactions are prohibited. Pursuits may continue into green zones only if a player enters the green zone to avoid IC consequences. Green Zones are currently: all hospitals.",
        ex: ["Attacking players inside a green zone.", "Initiating a robbery in a green zone.", "Making business deals or scamming people in a green zone."] },
    ],
  },
  {
    n: 13, title: "Staff Interactions & Enforcement Conduct", rules: [
      { id: "13.1", t: "Staff Impersonation", p: "F", d: "Impersonating staff, or taking actions as if you have staff authority, is prohibited due to the potential impact on players and the server." },
      { id: "13.2", t: "Unauthorized Enforcement", p: "C-F", d: "Players may not attempt to enforce rules, discipline others, or intervene in RP as a vigilante. Reporting violations to staff after the interaction has ended is the correct procedure. If you want to join the staff team, apply!" },
    ],
  },
  {
    n: 14, title: "Sensitive & Restricted Roleplay", note: "These two rules will not be tolerated at all. Both fall under Classification F.", rules: [
      { id: "14.1", t: "Sexualized Roleplay", p: "F", d: "Sexual RP of any kind will not be tolerated within the community. Last Chance Roleplay is open to members who are underage, so any sexual RP carries a zero tolerance policy." },
      { id: "14.2", t: "Self-Harm & Suicide Roleplay", p: "F", d: "RP involving self-harm or suicide should be avoided, even if all parties consent. These topics can be distressing and are unnecessary for engaging storylines." },
    ],
  },
];
