# General

* title=Paws & Pistons
* activeCharacter=Pip
* time=23:10:00
* background=countryside.png
* winSynopsis=Four stowaway animals sniffed out the bullion swap, matched the thief's missing crest-button, and barricaded the Baggage Car — stopping the Meridian Express before Coldwater Bridge.

# Map

```
LLBBDDPPOO
LLBBDDPPOO
LLBBDDPPOO
```

* L=Locomotive Cab
* B=Baggage Car
* D=Dining Car
* P=Parlor Car
* O=Observation Car

# Rooms

## Locomotive Cab

```
........
...S....
........
```

* S=Sully
* exits=Baggage Car

## Baggage Car

```
........
.T...K..
........
```

* T=The Porter
* K=Bullion Trunk
* exits=Dining Car

## Dining Car

```
........
.P.B.N.D
........
```

* P=Pip
* B=Baxter
* N=Nibbles
* D=Dot
* exits=Parlor Car

## Parlor Car

```
........
.A...Y..
........
```

* A=Lady Ashcombe
* Y=Decoy Trunk
* exits=Observation Car

## Observation Car

```
........
...V....
........
```

* V=Conductor Vane

# Characters

## Pip

* title=Thrill-Seeking Cat
* description=A lithe black cat with one white paw who is forever testing latches the others can't reach, purring "a locked door is just a door that hasn't met me yet" as she squeezes through the coal-tender hatch too small for any dog; she bats around a single brass button stamped with a railway crest, swiped clean off a man's cuff.
* faceImage=stickyAgatha.png
* items=Brass Crest Button

## Baxter

* title=Pack Leader
* description=A grizzled shepherd mix with a chewed left ear who waits for the whole group before any door and insists "we move together, or we don't move — nobody gets left in the dark"; he steps his body between the smaller animals and every human, a frayed shelter collar with a worn brass adoption tag at his throat.
* faceImage=larry.png

## Nibbles

* title=Scent Tracker
* description=A small wiry terrier whose nose never stops working the air, muttering "real gold smells like cold pennies and oil — that parlor trunk smells of nothing but cedar and lies" as he digs at one steamer trunk and ignores its identical twin, trailing fresh sawdust from where someone pried into a crate.
* faceImage=marty.png

## Dot

* title=Lookout Pup
* description=A trembling spotted pup who watches the doors and freezes a beat before anyone appears, whispering "someone's coming up the corridor — I heard a wrench clink against metal"; she keeps a chewed first-class ticket stub in her mouth that a stray pup could never have paid for.
* faceImage=anna.png

## The Porter

* title=Heist Ringleader
* description=A tall man in a porter's uniform a size too crisp and clean, missing one cuff button with a torn thread where a crest used to be; he lets himself into a sleeping passenger's car with a master key instead of knocking, murmuring low that "the trunks go off the back at Coldwater Bridge — nobody checks bullion in the dark" while checking a gold pocket watch against the bridge timetable rather than doing any porter's work.
* faceImage=heinrich.png
* items=Porter's Master Key

## Sully

* title=Accomplice
* description=A broad man in a dinner jacket that doesn't fit, coal dust packed under his fingernails, who holds a parlor-car ticket yet is always up at the locomotive where no passenger belongs; he carries a heavy pipe wrench bundled in a silk handkerchief to keep it quiet and mutters "once the trunks are clear, I jam her wide open — let 'em try to stop a runaway."
* faceImage=ugolino.png
* items=Silk-Wrapped Wrench

## Conductor Vane

* title=Honest Conductor
* description=A neat, tired older man with a ticket punch and a brass-buttoned coat — every button present and stamped with the line's own crest; he walks the full train punching tickets and frowning at the unfamiliar porter, carrying the passenger manifest and a whistle, noting "every soul on my manifest is accounted for, except four little stowaways and one porter I never hired."
* faceImage=andreas.png
* items=Passenger Manifest

## Lady Ashcombe

* title=Bullion Owner
* description=An elegant woman in furs who won't let any porter touch her brass-cornered steamer trunk, a small key on a chain at her throat, insisting "that trunk holds my family's gold — fully insured, mind you — and it does not leave my sight" before dozing off, only to wake and shriek that the corners are wrong and an identical trunk has taken its place.
* faceImage=queenFace.png

# Items

## Bullion Trunk

* description=A battered steamer trunk with brass corner caps, far heavier than it looks. The lid bows slightly under the weight inside, and through a hairline gap you catch the cold, oily gleam of stacked gold bars. A faded shipping label still reads "Ashcombe".
* image=coffer.png

## Decoy Trunk

* description=A steamer trunk identical to Lady Ashcombe's at a glance, but it lifts far too easily — empty. It smells of fresh cedar shavings rather than travel, and the brass corner caps are mounted a finger's width off true, the seams not quite matching the original's wear.
* image=coffer.png

## Porter's Master Key

* description=A long iron skeleton key worn smooth from handling, strung on a loop of waxed cord. Its teeth are filed to throw the locks of cars no honest porter has any business entering.
* image=masterKey.png

## Silk-Wrapped Wrench

* description=A heavy steel pipe wrench, its jaws swaddled in layers of dark silk to deaden any clang against metal. The silk is scuffed and oil-stained where it bit down hard on something — the kind of grip that could jam a throttle lever solid.
* image=wrench.png

## Passenger Manifest

* description=The conductor's ledger of every ticketed soul aboard, names inked in neat columns and checked off one by one. Run a finger down the list and there is no porter written anywhere on it.
* image=letter.png

## Brass Crest Button

* description=A small brass cuff button stamped with the rail line's winged-wheel crest, a few threads still clinging to its shank where it was torn loose. It is the exact match for the conductor's own buttons — and for the bare, frayed gap on the porter's cuff.
* image=brassButton.png

# Itinerary

23:10:00 Pip faces right
: says, "Listen up, crew. Something on this train stinks, and it isn't the kippers."
: Baxter says, "We move together, or we don't move. Nobody gets left in the dark."
: Nibbles says, "Real gold smells like cold pennies and oil. That parlor trunk? Cedar and lies."
: Dot says, "S-someone's coming up the corridor. I heard a wrench clink against metal."
: Pip thinks, "That porter's cuff is missing a button. I've got its twin under my paw."
: says, "Stay put and keep watch. I'm small enough to fit where dogs can't. I'll scout."
23:11:00 Pip @ Parlor Car
: faces left
: Lady Ashcombe sits
: says, "That trunk holds my family's gold — fully insured, mind you — and it does not leave my sight."
: lays
: Pip thinks, "Asleep already. And her brass-cornered trunk sits right here, looking far too light."
: says, "A locked door is just a door that hasn't met me yet. Sleep tight, milady."
23:13:00 Pip @ Observation Car
: faces right
: Conductor Vane says, "Every soul on my manifest is accounted for — except four little stowaways and one porter I never hired."
: faces left
: Pip thinks, "His coat buttons match the one I'm carrying exactly. So the porter stole HIS crest."
: Conductor Vane says, "Off you go, little stray. I've a whole train to punch before Coldwater Bridge."
: Pip @ Parlor Car.80%
: @ Dining Car
: Nibbles says, "You smell it too now, don't you? The cold-penny stink is up FORWARD. In the baggage car."
: Pip says, "Then forward we go. Quiet paws."
23:16:00 Pip @ Baggage Car
: faces left
: The Porter says, "The trunks go off the back at Coldwater Bridge. Nobody checks bullion in the dark."
: faces right
: Pip thinks, "THIS trunk reeks of gold and oil — the real one. The parlor twin was the decoy."
: The Porter says, "What's a scrawny cat doing back here? Shoo, before I shoo you off the moving train."
: Pip says, "Missing a cuff button, friend? Funny — I found one just like it."
23:19:00 Pip @ Locomotive Cab
: faces left
: Sully says, "Once the trunks are clear, I jam her wide open. Let 'em try to stop a runaway."
: faces right
: Pip thinks, "A pipe wrench wrapped in silk to jam the throttle. That's the keystone of the whole plan."
: says, "Not tonight you don't. The crew and I have seen enough."
23:20:30 Pip @ Baggage Car
: @ Dining Car
: says, "It's a bullion swap. Decoy trunk in the parlor, real gold in the baggage car, throttle to be jammed before Coldwater Bridge."
: Baxter says, "Then we barricade the baggage car and hold it. Together."
: Nibbles says, "And I'll prove the swap — one trunk smells of gold, the other of nothing but lies."
: Dot says, "I'll watch the doors. I always hear them coming first."
: Pip says, "And I've got the porter's own button to nail him. Paws and pistons, crew — let's stop this train."
23:21:30 Pip @ Locomotive Cab
: faces left
: says, "Step away from that throttle. The crew has the baggage car barricaded, and I've got your boss's button. This train stops here."

# Conclusions

* verbs=swapped|swap|stole|hid|jammed|smuggled|hauled

## Identities

* unlockConclusions=The Bullion Heist

## The Bullion Heist

* unlockConclusions=The Runaway Train
* conclusion=The [Heist Ringleader] used the [Porter's Master Key] to [swap] Lady Ashcombe's gold for the [Decoy Trunk], then had the [Accomplice] haul the real [Bullion Trunk] into the [Baggage Car].

## The Runaway Train

* conclusion=The [Accomplice] [jammed] the throttle in the [Locomotive Cab] with the [Silk-Wrapped Wrench], but the [Brass Crest Button] exposed the [Heist Ringleader].
