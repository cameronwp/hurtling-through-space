---
title: "Marvin: (Deep) Spacewalks"
date: 2018-01-15T10:16:02-06:00
tags:
  - marvin
  - spacewalk
  - nasa
  - basalt
  - neemo
summary: The future of spacewalks. How NASA astronauts and flight controllers manage EVAs, and the software we're building to support them on Mars and beyond.
twitterprompt: Cameron wants to go on a spacewalk
marvin: 1-Backstory
draft: false
---

![<-FULLWIDTH->astronaut Bruce McCandless II free floating in a spacesuit over the earth](freeflyer_nasa_cropped.jpg)

_Astronaut Bruce McCandless II free floating 100m from the space shuttle Challenger. See [APOD](https://apod.nasa.gov/apod/ap120101.html) for more info. Image copyright NASA._

Human beings in spacesuits outside of spacecraft have taken some of the most remarkable pictures of the modern age.

![<-FULLWIDTH->astronaut Aki Hoshide taking a self portrait in a spacesuit with the sun behind him and the camera and ISS visible in his visor](aki_selfportrait.jpg)

_JAXA Astronaut Aki Hoshide taking a selfie on a spacewalk. See [APOD](https://apod.nasa.gov/apod/ap120918.html) for more info. Image copyright NASA._

I’ve been fortunate enough to work with the space community for the last two years on a project to make their jobs easier. What follows is my account of the problems we wanted to solve, the research we (mostly my colleague Matthew Miller) did, the prototypes we built, the technical problems and mistakes along the way, and the evolution of Marvin, our software suite, from idea to stable software and funded research project.

---

Spacewalks fall under a broad mission category known as extravehicular activity (EVA).

Astronauts perform spacewalks routinely, but they're anything but routine. Crew members leave the spacecraft only when necessary, such as for hardware installations, repairs, and, during the Apollo missions, exploration.

<iframe width="560" height="315" src="https://www.youtube.com/embed/wbAF1EExpek?rel=0" frameborder="0" gesture="media" allow="encrypted-media" allowfullscreen></iframe>

_Funnily enough, this is one of the most realistic examples of EVA chatter I've seen in a movie (minus the fact they omitted the Earth-Mars time delay)._

Every astronaut on EVA faces heightened risk. They rely on localized life support systems (LSS), which provide limited consumable resources like oxygen and battery power. They face direct exposure to space, an already hostile environment even before considering the possibility of hardware malfunctions, micrometeroid impacts, sudden solar flares, and a million other incapacitating events. In the event of an emergency, crew members must react quickly and precisely to stave off disaster. In fact, over the nearly sixty-year history of EVAs, about 30%<><>cite with matthew's thesis<><> of EVAs have experienced some kind of incapacitating event that led to early ingress (_ingress_ refers to entering a spacecraft or habitat, as opposed to _egress_ when a crew member exits).

Given the risk inherent to EVAs as well as the general complexity of EVA tasks, each EVA is a highly choreographed event, sometimes years in the making. As an extreme example, the alpha magnetic spectrometer (AMS)<><>link<><>, an external piece of hardware onboard the International Space Station (ISS), currently needs repair (I believe a valve needs to be repaired, and it's unfortunately tucked deep within a nasty nest of sharp surfaces in an awkward location). NASA built a full-scale replica of the AMS for use underwater at the Neutral Buoyancy Lab (NBL, basically a massive swimming pool for weightlessness training) and astronauts will be training for at least two years for the mission.<><>cite if possible<><> Like every EVA, the crew members repairing the AMS will be in continuous, direct contact with personnel in Mission Control Center (MCC) throughout the mission. In fact, mission operations / flight controllers at MCC (who I'll frequently abbreviate as "ops") will effectively call every shot. They will keep track of the mission timeline, task status, and suit telemetry (data describing the state of the spacesuit), and they will control most assets like the Canadarm 2<><>link<><> as well. The astronauts themselves are almost robots or actresses following a script with little opportunity for ad-libbing. An additional crew member (or crew members) inside the spacecraft, known as the intervehicle (IV) crew member, will monitor many of the same variables as ground and will also communicate with extravehicle (EV) crew members.

The few people at risk in space benefit from dozens (maybe hundreds) of experts on the ground analyzing, predicting, and optimizing for mission success. In low Earth orbit (LEO), cis-lunar space (between Earth and the Moon) or on lunar EVAs, keeping MCC in the loop for all decision-making is a viable operations concept because the speed of light allows it. ISS orbits a few hundred kilometers above the ground, where the communication lag is somewhere in the hundreds of milliseconds - too high for most online video games but still good enough for FaceTime. Their latency is mostly a factor of the relative positions of ground and satellite relays rather than actual distance to Earth. In more official terms, we call the lag one-way latency time (OWLT). The Moon has an OWLT of just over one second. MCC to Moon communications are awkward (think a bad connection on an overseas video conference), but they still enable real-time communication and decision making.

Exploration targets past the Moon increasingly isolate crew members. Most reasonable near-Earth asteroid targets are distant enough that OWLT is measured in minutes. Mars has a OWLT between 4 and 22 minutes, depending on our orbital orientation. Ground cannot provide anything resembling real-time direction if we're hamstrung by question-response cycles that could take the better part of an hour. Clearly, we need to rethink our EVA operations concept before we get to Mars.

A NASA researcher, Matthew Miller, began working on this problem during his doctoral research at Georgia Tech. He asked how crew members could support themselves on EVA under time-delayed operational constraints. He envisioned a multi-pronged approach, where a mix of operational changes and technology would afford crew members greater independence. In a friend-of-a-friend set of circumstances, Matthew and I met two years ago and I agreed to help with the technology for his thesis, primarily by building the decision support system (DSS) software behind both the control group and a prototype with independence-enabling features. In the two years since then, we've been able to test our prototype with real astronauts on EVAs underwater on coral reefs in the Florida Keys, simulated astronauts hiking around lava flows in Hawaii and Idaho, and undergrads playing Martian explorers in laboratory controlled exercises at Georgia Tech.

The key to greater independence is augmenting the observational and predictive capability of the IV crew member who remains inside the spacecraft while her EV counterparts perform tasks outside. If an IV is as situationally aware of an EVA as the ground, our thinking goes, then the crew can safely perform EVAs without real-time support from MCC. Matthew spent hundreds of hours learning from NASA mission operations controllers, including observing ISS EVAs from MCC and interviews designed to extract the flow of information and level of importance of information on decision making during EVAs. He and I also participated in multiple analog EVA missions, during which we simulated exploration-style EVAs alongside multidisciplinary scientists, flight controllers, and operations researchers in the field. Currently, Matthew is continuing his research at [Jacobs](https://www.wehavespaceforyou.com/), a NASA contractor, where he is building a hybrid reality (VR + interactive physical objects) lab capable of repeated, controlled simulated EVAs (among other EVA-related projects).

## Why Marvin?

I’m a huge fan of sci-fi and _Hitchhiker’s Guide to the Galaxy_. Marvin the Paranoid Android constantly complains about how smart he is and how slim the odds are for survival. I figured that Marvin is the perfect name for a DSS keeping people alive in space.

> I have a million ideas. They all point to certain death.

> I’ve calculated your chance of survival, but I don’t think you’ll like it.

<><>cite these quotes?<><>

Incidentally, Matthew hadn't read it when I suggested Marvin for the name for the project. His response: "let me read the book first before I decide if it's okay for this name to end up in my thesis because that thing is kinda forever.” Not long after, the name Marvin became official.

(The name Marvin led to some funny conversations. Everything in the space industry is an acronym. I got a few responses like, “are you even _allowed_ to name something without an acronym?” when I explained that Marvin is not MARVIN.)

I’ll also [link to my coworker’s article](https://medium.com/@timvergenz/e511a4c5c88d) about naming conventions in software and how pop culture references aren’t always a good idea. There’s a difference between making a useful comparison and obfuscating the purpose of code. I’d argue that Marvin itself was an acceptable reference, but I think I toed the line later on when I extended the analogy to lesser known nouns in the HHG2G universe. I called the eventual server running Marvin the Heart of Gold, which is Marvin the Paranoid Android’s ship. The Infinite Improbability Drive was responsible for running calculations and predictions in Marvin. It got its name from the engine in the Heart of Gold that moves the ship by “[passing] through every conceivable point in every conceivable universe simultaneously.” Both examples make sense, but only if you know HHG2G. If Marvin ever expands to a team with more developers, these names will need to change.

_Coming up next: creating a control group for EVA research._

<sub>[Miller, Matthew. (2017). Decision Support System Development for Human Extravehicular Activity. . 10.13140/RG.2.2.17731.30248.](https://doi.org/10.13140/rg.2.2.17731.30248) (Matthew’s PhD Dissertation)</sub>

<sub>[Miller, M., Pittman, C., & Feigh, K. 2017, '
Next-Generation Human Extravehicular Spaceflight Operations Support Systems Development', IAC 2017. Adelaide, SA.](https://www.researchgate.net/publication/320290594_Next-Generation_Human_Extravehicular_Spaceflight_Operations_Support_Systems_Development)</sub>