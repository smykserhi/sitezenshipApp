import { Question } from "../types";

const FormQuestions: Question[] = [
  {
    "id": 200,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 1 – Claiming to be a U.S. citizen",
    "formQuestion": "Have you EVER claimed to be a U.S. citizen (in writing or any other way)?",
    "question": "You filled out a job application and checked a box that said 'Are you a U.S. citizen?' even though you are not. Does this need to be disclosed on the N-400?",
    "answers": [
      "Yes. Claiming to be a U.S. citizen in writing on any document — including job applications — must be disclosed, regardless of when it happened."
    ],
    "fakeAnswers": [
      "No, only official government forms require disclosure",
      "Only if you were under oath when you made the claim",
      "No, job applications are private and not reviewed by USCIS"
    ]
  },
  {
    "id": 201,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 1 – Claiming to be a U.S. citizen",
    "formQuestion": "Have you EVER claimed to be a U.S. citizen (in writing or any other way)?",
    "question": "A friend asked if you were American and you said 'yes' to avoid a long explanation. Do you need to report this on the N-400?",
    "answers": [
      "Yes. The question asks about claims made 'in any way,' which includes verbal statements. However, informal social contexts may differ from official claims — applicants should consult an immigration attorney if unsure."
    ],
    "fakeAnswers": [
      "No, verbal statements to friends are never considered official claims",
      "Only if your friend reported it to immigration authorities",
      "No, informal conversations are explicitly excluded from this question"
    ]
  },
  {
    "id": 202,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 2 – Registered to vote or voted",
    "formQuestion": "Have you EVER registered to vote or voted in any Federal, state, or local election in the United States?",
    "question": "You registered to vote in a U.S. federal election 10 years ago but never actually voted. Do you need to answer 'Yes' to this question?",
    "answers": [
      "Yes. The question asks if you have EVER registered to vote, not just voted. Registering alone requires answering 'Yes.'"
    ],
    "fakeAnswers": [
      "No, only actual votes need to be disclosed, not registrations",
      "Only if the registration was within the last 5 years",
      "No, the question only applies if you voted in a presidential election"
    ]
  },
  {
    "id": 203,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 2 – Registered to vote or voted",
    "formQuestion": "Have you EVER registered to vote or voted in any Federal, state, or local election in the United States?",
    "question": "Your city allows non-citizens to vote in local school board elections, and you voted in one. Do you need to answer 'Yes' to this question?",
    "answers": [
      "No. If you lawfully voted only in a local election where non-citizens (aliens) are eligible to vote, you may answer 'No.'"
    ],
    "fakeAnswers": [
      "Yes, all voting by non-citizens must always be disclosed",
      "Yes, but only if the local election affected federal policy",
      "Yes, voting in any election requires a 'Yes' answer on the N-400"
    ]
  },
  {
    "id": 204,
    "category": "TAX OBLIGATIONS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 3 – Overdue taxes",
    "formQuestion": "Do you currently owe any overdue Federal, state, or local taxes in the United States?",
    "question": "You owe back taxes to the IRS from two years ago and are currently on a payment plan. Should you answer 'Yes' to this question?",
    "answers": [
      "Yes. Owing overdue federal taxes — even if you are on a payment plan — means you currently owe overdue federal taxes and must answer 'Yes.'"
    ],
    "fakeAnswers": [
      "No, a payment plan means the debt is resolved and no longer overdue",
      "No, only taxes owed to the IRS count, not state or local taxes",
      "No, overdue taxes only matter if you owe more than $1,000"
    ]
  },
  {
    "id": 205,
    "category": "TAX OBLIGATIONS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 3 – Overdue taxes",
    "formQuestion": "Do you currently owe any overdue Federal, state, or local taxes in the United States?",
    "question": "You filed your federal tax return on time every year and owe nothing. How do you answer this question?",
    "answers": [
      "No. If you have no current overdue federal, state, or local tax obligations, you answer 'No.'"
    ],
    "fakeAnswers": [
      "Yes, you must always disclose your full tax history regardless",
      "Yes, USCIS requires a 'Yes' answer unless you have a letter from the IRS",
      "Yes, the question applies even if you've never had a tax issue"
    ]
  },
  {
    "id": 206,
    "category": "TAX OBLIGATIONS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 4 – Nonresident alien tax status",
    "formQuestion": "Since you became a lawful permanent resident, have you called yourself a \"nonresident alien\" on a Federal, state, or local tax return or decided not to file a tax return because you considered yourself to be a nonresident?",
    "question": "After becoming a lawful permanent resident, you filed a tax return as a 'nonresident alien' because your tax preparer advised you to. Does this need to be disclosed?",
    "answers": [
      "Yes. If you called yourself a nonresident alien on a tax return or chose not to file taxes for that reason after becoming a lawful permanent resident, you must answer 'Yes' regardless of who advised you."
    ],
    "fakeAnswers": [
      "No, if a licensed tax preparer advised it, you are not responsible for the decision",
      "No, this only applies if you voluntarily chose to file as a nonresident alien",
      "No, tax filing status is irrelevant to the naturalization process"
    ]
  },
  {
    "id": 207,
    "category": "POLITICAL AFFILIATIONS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 5a – Communist or totalitarian party membership",
    "formQuestion": "Have you EVER been a member of, involved in, or in any way associated with any Communist or totalitarian party anywhere in the world?",
    "question": "In your home country, membership in the ruling Communist Party was required for government employment and you were a member for 5 years. Do you need to disclose this?",
    "answers": [
      "Yes. Any past or present membership in a Communist or totalitarian party anywhere in the world must be disclosed. There are some exceptions (e.g., involuntary membership), which should be explained in Part 14."
    ],
    "fakeAnswers": [
      "No, involuntary or required membership is always exempt from disclosure",
      "No, only current party membership needs to be disclosed",
      "No, membership in foreign political parties is not relevant to U.S. naturalization"
    ]
  },
  {
    "id": 208,
    "category": "POLITICAL AFFILIATIONS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 5b – Advocating overthrow of government",
    "formQuestion": "Have you EVER advocated (supported and promoted) any of the following, or been a member of, involved in, or in any way associated with any group anywhere in the world that advocated any of the following: The overthrow by force or violence or other unconstitutional means of the Government of the United States or all forms of law; Opposition to all organized government; World communism; The establishment in the United States of a totalitarian dictatorship; The unlawful assaulting or killing of any officer or officers of the Government of the United States or of any other organized government because of their official character; The unlawful damage, injury, or destruction of property; or Sabotage?",
    "question": "You were a member of a student political group that publicly called for the violent overthrow of your home country's government. Do you need to disclose this?",
    "answers": [
      "Yes. Being associated with any group that advocated the overthrow by force or violence of any organized government must be disclosed, even if it occurred in another country."
    ],
    "fakeAnswers": [
      "No, student political organizations are exempt from this question",
      "No, only membership in parties recognized as terrorist organizations must be disclosed",
      "No, if the group was in another country, it does not need to be disclosed"
    ]
  },
  {
    "id": 209,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 6a – Using a weapon to harm",
    "formQuestion": "Have you EVER used a weapon or explosive with intent to harm another person or cause damage to property?",
    "question": "While serving as a police officer in another country, you fired your weapon at a suspect. Do you need to answer 'Yes' to this question?",
    "answers": [
      "Yes. Using a weapon with intent to harm a person must be disclosed regardless of your official role or the country where it occurred. You may explain the circumstances in Part 14."
    ],
    "fakeAnswers": [
      "No, law enforcement officers acting in official capacity are exempt from this question",
      "No, only incidents resulting in criminal charges must be disclosed",
      "No, use of a weapon abroad is not relevant unless it occurred in the United States"
    ]
  },
  {
    "id": 210,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 6b – Kidnapping, assassination, hijacking, or sabotage",
    "formQuestion": "Have you EVER engaged (participated) in kidnapping, assassination, or hijacking or sabotage of an airplane, ship, vehicle, or other mode of transportation?",
    "question": "You participated in planning (but not executing) a kidnapping of a political figure in your home country 20 years ago. Must this be disclosed?",
    "answers": [
      "Yes. The question asks if you EVER engaged in kidnapping, assassination, hijacking, or sabotage. Planning counts as participation and must be disclosed."
    ],
    "fakeAnswers": [
      "No, only actions you personally carried out need to be disclosed, not plans",
      "No, only if you were convicted of the kidnapping",
      "No, events more than 10 years old are excluded from this question"
    ]
  },
  {
    "id": 211,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 6c – Threatening or inciting harmful acts",
    "formQuestion": "Have you EVER threatened, attempted (tried), conspired (planned with others), prepared, planned, advocated for, or incited (encouraged) others to commit any of the acts listed in Item Numbers 6.a. or 6.b.?",
    "question": "You wrote online posts encouraging followers to destroy government property during a protest. Does this need to be disclosed?",
    "answers": [
      "Yes. Inciting or encouraging others to commit acts like property damage through unlawful means must be disclosed under this question."
    ],
    "fakeAnswers": [
      "No, social media posts are protected as free speech and not subject to disclosure",
      "No, only direct physical participation in damage must be disclosed",
      "No, inciting others is only relevant if they actually committed the act"
    ]
  },
  {
    "id": 212,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7a – Torture",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in torture?",
    "question": "You worked as a prison guard in another country and witnessed torture of inmates but did not participate yourself. Does this affect your answer?",
    "answers": [
      "No, if you only witnessed and did not participate. However, if you assisted, facilitated, or helped in any way, that would need to be disclosed. Question 9 (about working in detention facilities) may also apply."
    ],
    "fakeAnswers": [
      "Yes, witnessing any form of torture requires a 'Yes' answer",
      "Yes, prison guards are always considered participants regardless of direct involvement",
      "Yes, you must disclose any exposure to torture in a professional setting"
    ]
  },
  {
    "id": 213,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7b – Genocide",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in genocide?",
    "question": "You drove a truck that transported people who were later killed as part of a genocide, but you did not know this at the time. How should you answer?",
    "answers": [
      "This is a complex legal situation. You should consult an immigration attorney. If you had no knowledge of the purpose, you may be able to explain this, but the safest approach is to disclose and explain in Part 14."
    ],
    "fakeAnswers": [
      "No, transportation roles are always exempt from genocide-related questions",
      "No, only military personnel need to disclose involvement in genocide",
      "No, this question only applies if you were convicted in an international court"
    ]
  },
  {
    "id": 214,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7c – Killing or trying to kill",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in killing or trying to kill any person?",
    "question": "You were involved in a bar fight and hit someone who later died. You were not charged with murder. Must you disclose this?",
    "answers": [
      "Yes. The question asks if you have EVER killed or tried to kill any person, regardless of criminal charges or conviction. This must be disclosed and explained."
    ],
    "fakeAnswers": [
      "No, if you were not charged with homicide, you do not need to disclose it",
      "No, only premeditated killings need to be disclosed",
      "No, the question only applies to killings committed with a weapon"
    ]
  },
  {
    "id": 215,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7d – Non-consensual sexual contact",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in any kind of sexual contact or activity with any person who did not consent (did not agree) or was unable to consent (could not agree), or was being forced or threatened by you or by someone else?",
    "question": "You were convicted of sexual assault 15 years ago but the record was expunged. Must you disclose this?",
    "answers": [
      "Yes. The N-400 requires disclosure of all such conduct even if records were sealed, expunged, or cleared. You must answer 'Yes' and provide details."
    ],
    "fakeAnswers": [
      "No, expunged records are legally erased and do not need to be disclosed",
      "No, only convictions within the past 10 years must be disclosed",
      "No, if a judge cleared the record, USCIS cannot access it and disclosure is unnecessary"
    ]
  },
  {
    "id": 216,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7e – Intentionally severely injuring someone",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in intentionally and severely injuring or trying to injure any person?",
    "question": "During a fight, you broke someone's jaw intentionally. You were charged with battery but the charges were later dropped. Must this be disclosed?",
    "answers": [
      "Yes. Intentionally and severely injuring another person must be disclosed regardless of whether charges were filed, dropped, or whether records were cleared."
    ],
    "fakeAnswers": [
      "No, dropped charges are not convictions and do not need to be disclosed",
      "No, only convictions and guilty pleas must be reported on the N-400",
      "No, physical altercations without weapons are not covered by this question"
    ]
  },
  {
    "id": 217,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7f – Preventing someone from practicing religion",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in not letting someone practice his or her religion?",
    "question": "As a school administrator in another country, you enforced a policy banning students from wearing religious clothing. Does this need to be disclosed?",
    "answers": [
      "Yes. Preventing others from practicing their religion in any official or unofficial capacity must be disclosed."
    ],
    "fakeAnswers": [
      "No, enforcing school or institutional policies is not the same as personally preventing religious practice",
      "No, this question only applies to actions taken against individuals, not group policies",
      "No, only actions taken in a religious or military context need to be disclosed"
    ]
  },
  {
    "id": 218,
    "category": "CRIMINAL CONDUCT",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 7g – Harm based on race, religion, etc.",
    "formQuestion": "Have you EVER ordered, incited, called for, committed, assisted, helped with, or otherwise participated in causing harm or suffering to any person because of his or her race, religion, national origin, membership in a particular social group, or political opinion?",
    "question": "You participated in a hate crime targeting someone because of their religion, but were never arrested. Must you disclose this?",
    "answers": [
      "Yes. Causing harm to a person because of their race, religion, national origin, social group membership, or political opinion must always be disclosed, even without an arrest."
    ],
    "fakeAnswers": [
      "No, without an arrest or charge, there is nothing to disclose",
      "No, this question only applies to actions committed in the United States",
      "No, hate crimes are covered under a different section of the N-400"
    ]
  },
  {
    "id": 219,
    "category": "MILITARY SERVICE",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 8a – Military or police service",
    "formQuestion": "Have you EVER served in, been a member of, assisted (helped), or participated in any military or police unit?",
    "question": "You served in your home country's national army for two years as part of mandatory military service. Do you need to disclose this?",
    "answers": [
      "Yes. All military or police service in any country must be disclosed, including mandatory/conscripted service. Provide the country, unit name, rank, and dates in Part 14."
    ],
    "fakeAnswers": [
      "No, mandatory conscripted service is automatically excluded from this question",
      "No, only voluntary military service in a foreign country must be disclosed",
      "No, military service in your home country is irrelevant to U.S. naturalization"
    ]
  },
  {
    "id": 220,
    "category": "MILITARY SERVICE",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 8b – Armed group membership",
    "formQuestion": "Have you EVER served in, been a member of, assisted (helped), or participated in any armed group (a group that carries weapons), for example: paramilitary unit (a group of people who act like a military group but are not part of the official military), self-defense unit, vigilante unit, rebel group, or guerrilla group?",
    "question": "You were briefly a member of a neighborhood self-defense militia in your home country during a period of civil unrest. Do you need to disclose this?",
    "answers": [
      "Yes. Membership in any armed group, including self-defense units, vigilante groups, or militias, must be disclosed even if the group was informal or your involvement was brief."
    ],
    "fakeAnswers": [
      "No, informal neighborhood groups are not considered armed groups under this question",
      "No, only membership in internationally designated terrorist groups must be disclosed",
      "No, self-defense groups formed during civil unrest are legally exempt"
    ]
  },
  {
    "id": 221,
    "category": "DETENTION FACILITIES",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 9 – Working in a detention facility",
    "formQuestion": "Have you EVER worked, volunteered, or otherwise served in a place where people were detained (forced to stay), for example, a prison, jail, prison camp (a camp where prisoners of war or political prisoners are kept), detention facility, or labor camp, or have you EVER directed or participated in any other activity that involved detaining people?",
    "question": "You worked as a cook at a prison in your home country for three years. Do you need to answer 'Yes' to this question?",
    "answers": [
      "Yes. Working in any capacity — including support roles like cooking — at a place where people were detained (prison, jail, detention center, labor camp, etc.) must be disclosed."
    ],
    "fakeAnswers": [
      "No, support staff like cooks are not considered to have 'worked in' a detention facility",
      "No, only security and administrative staff need to disclose employment at detention facilities",
      "No, this question only applies to facilities located in the United States"
    ]
  },
  {
    "id": 222,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 10a – Group that used weapons",
    "formQuestion": "Were you EVER a part of any group, or did you EVER help any group, unit, or organization that used a weapon against any person, or threatened to do so?",
    "question": "You were a member of a political party that had an armed wing, though you personally worked only in the party's administrative office. Do you need to answer 'Yes'?",
    "answers": [
      "Yes. Being part of any group that used or threatened to use weapons against persons must be disclosed, even if your personal role was non-violent."
    ],
    "fakeAnswers": [
      "No, only members of the armed wing itself need to disclose association with the group",
      "No, administrative or office roles are explicitly exempt from this question",
      "No, only paid members of armed organizations need to disclose involvement"
    ]
  },
  {
    "id": 223,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 10b – Using a weapon as part of the group",
    "formQuestion": "If you answered \"Yes\" to Item Number 10.a., when you were part of this group, or when you helped this group, did you ever use a weapon against another person?",
    "question": "Following up on Item 10a — if you answered 'Yes,' and you personally never handled or used a weapon while in that group, how do you answer 10b?",
    "answers": [
      "No. If you were a member of such a group but personally never used a weapon against another person while part of it, you answer 'No' to 10b. However, answer 10c if you made threats."
    ],
    "fakeAnswers": [
      "Yes, being a member of the group means you used a weapon regardless of personal actions",
      "Yes, all members of armed groups are assumed to have used weapons",
      "Yes, you must answer 'Yes' to 10b if you answered 'Yes' to 10a"
    ]
  },
  {
    "id": 224,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 10c – Threatening use of a weapon",
    "formQuestion": "If you answered \"Yes\" to Item Number 10.a., when you were part of this group, or when you helped this group, did you ever threaten another person that you would use a weapon against that person?",
    "question": "While a member of an armed political group, you told an informant that you would shoot them if they reported on the group's activities. How do you answer 10c?",
    "answers": [
      "Yes. Threatening another person with a weapon while part of a group that uses weapons must be disclosed by answering 'Yes' to Item 10c."
    ],
    "fakeAnswers": [
      "No, verbal threats without a weapon present do not count under this question",
      "No, only written threats need to be disclosed",
      "No, threatening an informant is covered under a different section of the N-400"
    ]
  },
  {
    "id": 225,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 11 – Weapons training",
    "formQuestion": "Have you EVER received any weapons training, paramilitary training, or other military-type training?",
    "question": "You completed a government-sponsored weapons training course as part of your required military service. Do you need to disclose this?",
    "answers": [
      "Yes. Any weapons training, paramilitary training, or military-type training ever received must be disclosed, including training received during official mandatory military service."
    ],
    "fakeAnswers": [
      "No, weapons training received as part of mandatory military service is exempt",
      "No, government-sponsored training programs are excluded from this question",
      "No, only paramilitary or guerrilla training needs to be disclosed"
    ]
  },
  {
    "id": 226,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 12 – Selling or transporting weapons",
    "formQuestion": "Have you EVER sold, provided, or transported weapons, or assisted any person in selling, providing, or transporting weapons, which you knew or believed would be used against another person?",
    "question": "You worked as a licensed firearms dealer in another country and sold guns legally. Do you need to answer 'Yes' to this question?",
    "answers": [
      "Yes, if you knew or believed the weapons would be used against another person. Legal licensed sales where you had no reason to believe weapons would be used against someone may not require 'Yes,' but consult an attorney if uncertain."
    ],
    "fakeAnswers": [
      "No, all licensed and legal firearms sales are fully exempt from this question",
      "No, legal commercial sales in another country never need to be disclosed",
      "No, you only need to disclose weapons sales if you personally transported them across a border"
    ]
  },
  {
    "id": 227,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 13 – Recruiting minors for armed groups",
    "formQuestion": "Have you EVER recruited (asked), enlisted (signed up), conscripted (required to join), or used any person under 15 years of age to serve in or help an armed group, or attempted or worked with others to do so?",
    "question": "You helped organize a youth program for a rebel group that included teenagers under 15 in non-combat support roles like carrying messages. Must this be disclosed?",
    "answers": [
      "Yes. Recruiting or using any person under 15 years of age to serve in or help an armed group — in any capacity — must be disclosed."
    ],
    "fakeAnswers": [
      "No, non-combat support roles for minors are exempt from this question",
      "No, only minors who carried weapons need to be included in the disclosure",
      "No, this question only applies to formal military organizations, not rebel groups"
    ]
  },
  {
    "id": 228,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 14 – Using minors in hostilities",
    "formQuestion": "Have you EVER used any person under 15 years of age to take part in hostilities or attempted or worked with others to do so? This could include participating in combat or providing services related to combat (such as serving as a messenger or transporting supplies).",
    "question": "During a conflict, you directed children under 15 to serve as lookouts or supply carriers for your armed unit. Must this be disclosed?",
    "answers": [
      "Yes. Using persons under 15 in any role related to hostilities — including support roles like carrying supplies or serving as messengers — must be disclosed."
    ],
    "fakeAnswers": [
      "No, lookouts and supply carriers are not considered participants in hostilities",
      "No, children must have directly engaged in combat for this to apply",
      "No, this question only applies if the children were under 10 years of age"
    ]
  },
  {
    "id": 229,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 15a – Committing a crime without arrest",
    "formQuestion": "Have you EVER committed, agreed to commit, asked someone else to commit, helped commit, or tried to commit a crime or offense for which you were NOT arrested?",
    "question": "You shoplifted from a store years ago and were never caught or arrested. Do you need to disclose this?",
    "answers": [
      "Yes. Item 15a asks if you have EVER committed a crime for which you were NOT arrested. All crimes must be disclosed even if you were never caught, charged, or arrested."
    ],
    "fakeAnswers": [
      "No, if you were never arrested or caught, there is nothing to disclose",
      "No, only crimes for which you were formally charged need to be reported",
      "No, minor theft offenses under a certain dollar amount are exempt"
    ]
  },
  {
    "id": 230,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 15b – Arrests, citations, or charges",
    "formQuestion": "Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?",
    "question": "You received a DUI citation 8 years ago but the charge was dismissed. Do you need to disclose this?",
    "answers": [
      "Yes. Any arrest, citation, detention, or charge — including dismissed charges and DUI — must be disclosed regardless of the outcome or how long ago it occurred."
    ],
    "fakeAnswers": [
      "No, dismissed charges are legally considered as if they never occurred",
      "No, only DUI convictions within the past 5 years need to be disclosed",
      "No, traffic-related offenses are handled separately and not covered here"
    ]
  },
  {
    "id": 231,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 15b – Arrests, citations, or charges",
    "formQuestion": "Have you EVER been arrested, cited, detained or confined by any law enforcement officer, military official (in the U.S. or elsewhere), or immigration official for any reason, or been charged with a crime or offense?",
    "question": "A judge told you that your criminal record was expunged and you no longer need to disclose it to anyone. Can you answer 'No' based on this advice?",
    "answers": [
      "No. The N-400 explicitly requires disclosure even if a judge, attorney, or law enforcement officer told you the record was cleared or that you do not need to disclose it. You must still answer 'Yes' and provide details."
    ],
    "fakeAnswers": [
      "Yes, if a judge said you don't have to disclose it, that instruction overrides the N-400",
      "Yes, expunged records are legally sealed and USCIS has no access to them",
      "Yes, a lawyer's or judge's advice to not disclose always takes precedence over form instructions"
    ]
  },
  {
    "id": 232,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 16 – Completed probation or parole",
    "formQuestion": "If you received a suspended sentence, were placed on probation, or were paroled, have you completed your suspended sentence, probation, or parole?",
    "question": "You were convicted of a crime, placed on probation for 2 years, and completed it successfully. How does this affect Item 16?",
    "answers": [
      "You answer 'Yes' to Item 16, confirming you have completed your probation. This is a required follow-up to disclosing any suspended sentence or probation in Item 15."
    ],
    "fakeAnswers": [
      "No, completing probation means the matter is fully resolved and no further disclosure is needed",
      "No, probation that ended more than 5 years ago does not need to be disclosed",
      "No, only prison sentences — not probation — need to be reported on the N-400"
    ]
  },
  {
    "id": 233,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17a – Prostitution",
    "formQuestion": "Have you EVER engaged in prostitution, attempted to procure or import prostitutes or persons for the purpose of prostitution, or received any proceeds or money from prostitution?",
    "question": "You worked as a prostitute in a country where it was legal at the time. Must this be disclosed?",
    "answers": [
      "Yes. The question asks if you have EVER engaged in prostitution anywhere in the world. Legal status in the other country does not exempt you from disclosure."
    ],
    "fakeAnswers": [
      "No, activities that were legal in the country where they occurred do not need to be disclosed",
      "No, this question only applies to prostitution that occurred in the United States",
      "No, only profiting from others' prostitution (not personal engagement) must be disclosed"
    ]
  },
  {
    "id": 234,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17b – Drug trafficking",
    "formQuestion": "Have you EVER manufactured, cultivated, produced, distributed, dispensed, sold, or smuggled (trafficked) any controlled substances, illegal drugs, narcotics, or drug paraphernalia in violation of any law or regulation of a U.S. state, the United States, or a foreign country?",
    "question": "You sold marijuana in a U.S. state where it is now legal, but the sale occurred before legalization. Must this be disclosed?",
    "answers": [
      "Yes. The question asks about distributing controlled substances in violation of any law or regulation at the time. If the sale violated law at the time it occurred, it must be disclosed."
    ],
    "fakeAnswers": [
      "No, if the substance is now legal, past sales are no longer considered violations",
      "No, only drug convictions that resulted in jail time need to be disclosed",
      "No, marijuana-related offenses are exempt because federal policy has changed"
    ]
  },
  {
    "id": 235,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17c – Polygamy",
    "formQuestion": "Have you EVER been married to more than one person at the same time?",
    "question": "You were legally married to two people simultaneously under the laws of your home country, where polygamy is permitted. Do you need to disclose this?",
    "answers": [
      "Yes. Being married to more than one person at the same time must be disclosed regardless of the laws of the country where it occurred."
    ],
    "fakeAnswers": [
      "No, marriages that were legal under the laws of the country where they occurred are exempt",
      "No, this question only applies to marriages that took place in the United States",
      "No, only polygamous marriages entered into after becoming a permanent resident must be disclosed"
    ]
  },
  {
    "id": 236,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17d – Marriage for immigration benefit",
    "formQuestion": "Have you EVER married someone in order to obtain an immigration benefit?",
    "question": "You married your current spouse because doing so would help you get a green card, but you also genuinely love them. How should you answer this question?",
    "answers": [
      "If the marriage was entered into primarily or solely to obtain an immigration benefit and was not a genuine marriage, answer 'Yes.' A bona fide marriage that also results in an immigration benefit is not fraud. Consult an attorney if you are unsure."
    ],
    "fakeAnswers": [
      "Yes, any marriage that resulted in an immigration benefit must always be answered 'Yes'",
      "Yes, USCIS considers all immigration-related marriages as fraudulent by default",
      "Yes, the question applies regardless of the genuine nature of the relationship"
    ]
  },
  {
    "id": 237,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17e – Helping someone enter illegally",
    "formQuestion": "Have you EVER helped anyone to enter, or try to enter, the United States illegally?",
    "question": "You drove a family member across the border without proper documentation. Must this be disclosed?",
    "answers": [
      "Yes. Helping anyone — including family members — enter or attempt to enter the United States illegally must be disclosed."
    ],
    "fakeAnswers": [
      "No, helping immediate family members is explicitly exempt from this question",
      "No, this question only applies if money was exchanged for the transportation",
      "No, only smuggling strangers for profit needs to be disclosed"
    ]
  },
  {
    "id": 238,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17f – Illegal gambling",
    "formQuestion": "Have you EVER gambled illegally or received income from illegal gambling?",
    "question": "You ran an informal sports betting pool at your workplace where participants paid money. Do you need to disclose this?",
    "answers": [
      "Yes. Running an illegal gambling operation — including informal betting pools that violate local laws — must be disclosed."
    ],
    "fakeAnswers": [
      "No, informal workplace pools are considered social activities, not illegal gambling",
      "No, this question only applies to gambling in states where it is federally prohibited",
      "No, only gambling debts, not running a pool, need to be disclosed"
    ]
  },
  {
    "id": 239,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17g – Failure to pay support",
    "formQuestion": "Have you EVER failed to support your dependents (pay child support) or to pay alimony (court-ordered financial support after divorce or separation)?",
    "question": "You fell behind on child support payments for six months three years ago but have since caught up. Must this be disclosed?",
    "answers": [
      "Yes. If a court ordered you to pay child support or alimony and you failed to pay it (even temporarily), this must be disclosed."
    ],
    "fakeAnswers": [
      "No, if you are currently caught up, past delinquency does not need to be disclosed",
      "No, this question only applies if you were taken to court for non-payment",
      "No, only current unpaid support obligations are relevant to the N-400"
    ]
  },
  {
    "id": 240,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 17h – Misrepresentation for public benefits",
    "formQuestion": "Have you EVER made any misrepresentation to obtain any public benefit in the United States?",
    "question": "You listed a family member as a household member to qualify for a higher level of food assistance benefits, even though they did not live with you. Must this be disclosed?",
    "answers": [
      "Yes. Making any misrepresentation — including false household information — to obtain public benefits in the United States must be disclosed."
    ],
    "fakeAnswers": [
      "No, food assistance programs are state-run and not covered by this federal question",
      "No, only misrepresentations made directly to USCIS or immigration authorities need to be disclosed",
      "No, this question only applies to federal housing or medical benefits, not food assistance"
    ]
  },
  {
    "id": 241,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 18 – False information to U.S. Government",
    "formQuestion": "Have you EVER given any U.S. Government officials any information or documentation that was false, fraudulent, or misleading?",
    "question": "When applying for your visa, you told the consular officer you had never been arrested, which was untrue. Must this be disclosed on the N-400?",
    "answers": [
      "Yes. Providing false, fraudulent, or misleading information or documents to any U.S. Government official at any time must be disclosed."
    ],
    "fakeAnswers": [
      "No, visa applications are handled by the State Department, not USCIS, so they are irrelevant here",
      "No, only misrepresentations made after entering the United States need to be disclosed",
      "No, if the visa was approved, USCIS considers the information verified and disclosure is not needed"
    ]
  },
  {
    "id": 242,
    "category": "CITIZENSHIP CLAIMS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 19 – Lying to gain entry or immigration benefits",
    "formQuestion": "Have you EVER lied to any U.S. Government officials to gain entry or admission into the United States or to gain immigration benefits while in the United States?",
    "question": "At the border, you claimed you were visiting for tourism but your real intent was to seek employment. Must this be disclosed?",
    "answers": [
      "Yes. Lying to U.S. Government officials to gain entry into the United States — including misrepresenting the purpose of a visit — must be disclosed."
    ],
    "fakeAnswers": [
      "No, misrepresenting travel intent is a common occurrence and is not subject to disclosure",
      "No, this question only applies to misrepresentations made at immigration courts, not ports of entry",
      "No, only misrepresentations about your identity or criminal history need to be disclosed"
    ]
  },
  {
    "id": 243,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 20 – Removal or deportation",
    "formQuestion": "Have you EVER been removed or deported from the United States?",
    "question": "You were formally removed from the United States seven years ago and then re-entered legally with a new immigrant visa. Must you disclose the removal?",
    "answers": [
      "Yes. Any prior removal or deportation from the United States must be disclosed, regardless of your current lawful status."
    ],
    "fakeAnswers": [
      "No, a new lawful entry cancels out any prior removal and disclosure is no longer required",
      "No, only removals that occurred within the past 10 years need to be disclosed",
      "No, if you were re-admitted to the U.S., prior removal is no longer relevant"
    ]
  },
  {
    "id": 244,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 21 – Removal proceedings",
    "formQuestion": "Have you EVER been placed in removal, rescission, or deportation proceedings?",
    "question": "You received a Notice to Appear (NTA) for removal proceedings several years ago, but the case was terminated in your favor. Must this be disclosed?",
    "answers": [
      "Yes. Ever being placed in removal, rescission, or deportation proceedings must be disclosed even if the proceedings were terminated or decided in your favor."
    ],
    "fakeAnswers": [
      "No, if the case was decided in your favor, you never have to disclose it",
      "No, only active or pending removal proceedings need to be disclosed",
      "No, a terminated case is equivalent to never having been in proceedings"
    ]
  },
  {
    "id": 245,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 22a/22b – Selective Service registration",
    "formQuestion": "Are you a male who lived in the United States at any time between your 18th and 26th birthdays? (Do not select \"Yes\" if you were a lawful nonimmigrant for all of that time period.)",
    "question": "You are a male who lived in the U.S. from age 19 to 24 on a student visa (lawful nonimmigrant status the entire time). Do you need to answer 'Yes' to 22a?",
    "answers": [
      "No. If you were a lawful nonimmigrant for the entire period between your 18th and 26th birthdays, you do not need to answer 'Yes' to 22a."
    ],
    "fakeAnswers": [
      "Yes, any time lived in the U.S. between 18 and 26 requires a 'Yes' regardless of visa type",
      "Yes, student visas are considered immigrant status and Selective Service applies",
      "Yes, you must register even if you were on a nonimmigrant visa during that period"
    ]
  },
  {
    "id": 246,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 22a/22b – Selective Service registration",
    "formQuestion": "If you answered \"Yes\" to Item Number 22.a., did you register for the Selective Service?",
    "question": "You are a male who became a lawful permanent resident at age 20 and lived in the U.S. until age 25 but never registered for Selective Service. How do you answer 22a and 22b?",
    "answers": [
      "Answer 'Yes' to 22a (you lived in the U.S. during the relevant age range as more than a nonimmigrant) and 'No' to 22b (you did not register). You must then review the instructions for guidance, as failure to register may affect your application."
    ],
    "fakeAnswers": [
      "Answer 'No' to both — LPR status before age 26 exempts you from Selective Service",
      "Answer 'Yes' to 22a and 'Yes' to 22b — LPR status counts as registration",
      "Answer 'No' to 22a — permanent residents are exempt from the Selective Service requirement"
    ]
  },
  {
    "id": 247,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 23 – Leaving U.S. to avoid draft",
    "formQuestion": "Have you EVER left the United States to avoid being drafted in the U.S. armed forces?",
    "question": "During the Vietnam War era, you left the United States and moved abroad specifically to avoid being drafted. Must this be disclosed?",
    "answers": [
      "Yes. Leaving the United States to avoid being drafted into the U.S. armed forces must be disclosed, no matter how long ago it occurred."
    ],
    "fakeAnswers": [
      "No, the Vietnam-era draft is no longer relevant and past draft avoidance does not need to be disclosed",
      "No, this question only applies to people who were formally notified of their draft obligation",
      "No, leaving the country is not the same as refusing the draft, so no disclosure is required"
    ]
  },
  {
    "id": 248,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 24 – Exemption from military service",
    "formQuestion": "Have you EVER applied for any kind of exemption from military service in the U.S. armed forces?",
    "question": "You applied for and received conscientious objector status to be exempt from combat military service. Must this be disclosed?",
    "answers": [
      "Yes. Any application for any kind of exemption from military service in the U.S. armed forces must be disclosed."
    ],
    "fakeAnswers": [
      "No, conscientious objector status is a legal right and does not need to be disclosed",
      "No, exemptions approved by the government are automatically recorded and do not require self-reporting",
      "No, only exemptions based on medical conditions need to be disclosed on the N-400"
    ]
  },
  {
    "id": 249,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 25 – Served in U.S. armed forces",
    "formQuestion": "Have you EVER served in the U.S. armed forces?",
    "question": "You served in the U.S. Army Reserve for four years but were never called to active duty. Do you answer 'Yes' to this question?",
    "answers": [
      "Yes. Service in any branch of the U.S. armed forces, including the Reserve or National Guard, counts as serving in the U.S. armed forces and must be disclosed."
    ],
    "fakeAnswers": [
      "No, Reserve service without active duty deployment is not considered military service under this question",
      "No, only active-duty service of more than 180 days needs to be disclosed",
      "No, National Guard and Reserve service are handled separately and are not relevant here"
    ]
  },
  {
    "id": 250,
    "category": "MILITARY SERVICE",
    "section": "Additional information about you",
    "formItem": "Part 9, Items 26a-26d – Current military status",
    "formQuestion": "Are you currently a member of the U.S. armed forces?",
    "question": "You are currently an active-duty member of the U.S. Army and are scheduled to deploy overseas in two months. What must you do when answering 26a and 26b?",
    "answers": [
      "Answer 'Yes' to 26a (currently a member). Answer 'Yes' to 26b (scheduled to deploy within 3 months). You should also call the Military Help Line at 877-247-4645 if you transfer duty stations or are deployed after filing."
    ],
    "fakeAnswers": [
      "Answer 'Yes' to 26a only — upcoming deployment is not relevant until you actually leave",
      "Answer 'No' to 26b — the 3-month window only applies after you receive official deployment orders",
      "Answer 'Yes' to 26a and skip 26b — 26b only applies to overseas deployments, not vessel assignments"
    ]
  },
  {
    "id": 251,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 27 – Discharged for being an alien",
    "formQuestion": "Have you EVER been discharged from training or service in the U.S. armed forces because you were an alien?",
    "question": "You were discharged from the U.S. Army early because your immigration status changed and you were determined to be an alien. Must this be disclosed?",
    "answers": [
      "Yes. Being discharged from the U.S. armed forces because you were an alien must be disclosed."
    ],
    "fakeAnswers": [
      "No, immigration-based discharges are handled separately and do not need to be disclosed here",
      "No, this question only applies to disciplinary discharges, not administrative ones",
      "No, only discharges that occurred after serving at least one year need to be disclosed"
    ]
  },
  {
    "id": 252,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 28 – Court-martial or dishonorable discharge",
    "formQuestion": "Have you EVER been court-martialed or have you received a discharge characterized as other than honorable, bad conduct, or dishonorable, while in the U.S. armed forces?",
    "question": "You received a general (under honorable conditions) discharge from the military. Do you need to answer 'Yes' to Item 28?",
    "answers": [
      "No. Item 28 specifically asks about discharges characterized as other than honorable, bad conduct, or dishonorable — and court-martials. A general discharge under honorable conditions does not require a 'Yes' answer."
    ],
    "fakeAnswers": [
      "Yes, any discharge that is not fully honorable must be disclosed under Item 28",
      "Yes, general discharges are considered 'other than honorable' and must be reported",
      "Yes, all military discharge types other than 'Honorable' trigger a 'Yes' answer"
    ]
  },
  {
    "id": 253,
    "category": "VOTING RIGHTS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 29 – Desertion",
    "formQuestion": "Have you EVER deserted from the U.S. armed forces?",
    "question": "You went AWOL (absent without leave) for 10 days from your U.S. military unit before returning. Does this count as desertion?",
    "answers": [
      "AWOL and desertion are legally distinct. AWOL alone may not constitute desertion, but this is a complex legal question. Consult an immigration attorney to determine whether your absence meets the legal definition of desertion for N-400 purposes."
    ],
    "fakeAnswers": [
      "Yes, any period of unauthorized absence from military duty is legally classified as desertion",
      "Yes, AWOL periods of more than 3 days are automatically considered desertion under military law",
      "Yes, returning to duty does not cancel out the AWOL period for naturalization purposes"
    ]
  },
  {
    "id": 254,
    "category": "TAX OBLIGATIONS",
    "section": "Additional information about you",
    "formItem": "Part 9, Item 30a/30b – Hereditary title or nobility",
    "formQuestion": "Do you now have, or did you EVER have, a hereditary title or an order of nobility in any foreign country?",
    "question": "You are a member of a royal family in your home country and hold an inherited title, but you have no actual power or government role. Must this be disclosed?",
    "answers": [
      "Yes. Holding any hereditary title or order of nobility in a foreign country — regardless of whether it carries any real power — must be disclosed. You will also be asked if you are willing to renounce that title at your naturalization ceremony."
    ],
    "fakeAnswers": [
      "No, ceremonial titles with no governmental authority are exempt from this question",
      "No, only titles that grant land ownership or financial benefits need to be disclosed",
      "No, this question only applies to titles in countries that the U.S. has a treaty with"
    ]
  },
  {
    "id": 255,
    "category": "OATH OF ALLEGIANCE",
    "section": "Additional information about you",
    "formItem": "Part 9, Items 31-37 – Oath of Allegiance commitments",
    "formQuestion": "If the law requires it, are you willing to bear arms (carry weapons) on behalf of the United States?",
    "question": "You are a pacifist and are not willing to bear arms under any circumstances. Can you still apply for naturalization?",
    "answers": [
      "Yes. Applicants who are unwilling to bear arms due to religious training or belief may request a modified Oath of Allegiance. They may still be required to perform noncombatant military service or work of national importance under civilian direction. Disclose this and see the Oath of Allegiance section of the N-400 Instructions."
    ],
    "fakeAnswers": [
      "No, pacifists are ineligible for naturalization and cannot apply for a modified oath",
      "No, you must be willing to bear arms unconditionally or your application will be denied",
      "No, USCIS does not recognize conscientious objector status for naturalization purposes"
    ]
  },
  {
    "id": 256,
    "category": "OATH OF ALLEGIANCE",
    "section": "Additional information about you",
    "formItem": "Part 9, Items 31-37 – Oath of Allegiance commitments",
    "formQuestion": "If the law requires it, are you willing to perform noncombatant services (do something that does not include fighting in a war) in the U.S. armed forces?",
    "question": "You do not understand what 'noncombatant services in the armed forces' means. What is an example of this?",
    "answers": [
      "Noncombatant service includes roles in the military that do not involve direct combat, such as working as a medic, cook, clerk, or in logistics. You would serve in the military but not engage in fighting."
    ],
    "fakeAnswers": [
      "Noncombatant service means you are exempt from all military service obligations",
      "Noncombatant service refers to volunteer community work such as teaching or disaster relief",
      "Noncombatant service means serving in a foreign military as a neutral party observer"
    ]
  }
];

export default FormQuestions;