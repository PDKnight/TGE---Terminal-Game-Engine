<?php
$space = str_repeat("\n", 60);
$map = [
	"text" => [
		"\n\n",
		"&6Welcome to this game!",
		"&rPlease type &f? or help &rfor further information! :)",
		"Psst..use &fls &rcommand everytime you want to list all the directories and items in your current position.",
		"------------------------",
		" road               pub ",
		"-------+     +----------",
		"   @   |     |  @       ",
		"     +-+     +-+     @  ",
		" @   |  HOUSE  |  @     ",
		"     +---------+        ",
		"",
		"It's monday night, 5th of October 1980. You've woken up in lonely house in west America.",
		"The house is pretty old and nobody's around the place, only some tumbleweeds.",
		"You can go on the road or to the pub."
	],
	"dirs" => [
		"road" => [
			"text" => [
				"$space",
				" @              @       ",
				"       @             @  ",
				"------------------------",
				" cave                .. ",
				"------------------------",
				"    @              @    ",
				"                @       ",
				"",
				"Almost. You are now on a dirty road with some bushes around.",
				"Type &fcd cave &rto go to the old coal cave or type &fcd .. &rto go back."
			],
			"dirs" => [
				"cave" => [
					"text" => [
						"$space",
						" . .|       @         o¬",
						" . .|#-+         @      ",
						"<=<=(   +---------------",
						"mine(                .. ",
						"<=<=(   +---------------",
						" . .|#-+             @  ",
						" . .|       @           ",
						"",
						"You are at the cave. Now type &fls &rto list all",
						"places (directories) and items (files) to pick."
					],
					"pick" => ["oldkey"],
					"dirs" => [
						"mine" => [
							"text" => [
								"$space",
								" . . .++--------++. . . ",
								" . ++-++  |[]|  ++-++ . ",
								"<<-<<              ++=>)",
								"dark_room           .. )",
								"<<-<<              ++=>)",
								" . ++-++        ++-++ . ",
								" . . .++--------++. . . ",
								"",
								"You're at the mine. There's a blinking light on the ceiling,",
								"probably because of destructed cables around it."
							],
							"items" => ["oldkey"],
							"pick" => ["stone"],
							"dirs" => [
								"dark_room" => [
									"text" => [
										"$space",
										"                  <     ",
										"                 . <    ",
										"                  .<<-<<",
										"                     .. ",
										"                 . <<-<<",
										"               .  <     ",
										"               <<<      ",
										"",
										"Dark and dark. You can't see around, only some items."
									],
									"pick" => ["ladder"],
									"dirs" => ["no_way" => []]
								],
								"hole" => [
									"text" => [
										"$space",
										"           --           ",
										"          |[]|          ",
										"     -----    ----      ",
										"     ==        []|      ",
										"      |@@        |      ",
										"      ------------      ",
										"                        ",
										"",
										"It seems to be a little technical room.",
										"You can hear some noise from running computers in corners."
									],
									"items" => ["ladder"],
									"dirs" => [
										"storage" => [
											"text" => [
												"$space",
												"                        ",
												"                        ",
												"  ]----------------     ",
												"==]=o=           ==     ",
												"  ]---|{}{}  {}{}|      ",
												"      ------------      ",
												"                        ",
												"",
												"Storage room. There are also several rails and a cart,",
												"but it needs a generator to move the iron wall away."
											],
											"pick" => ["coal", "lantern"],
											"dirs" => [
												"rails" => [
													"text" => [
														"$space",
														"                        ",
														"                        ",
														"------------------------",
														"======================o=",
														"------------------------",
														"                        ",
														"                        ",
														"",
														"Rails, rails. You're in a cart with your lantern",
														"hearing repeating clicky sound of rails.",
														"",
														"After several minutes travelling you can see a light",
														"at the end of the cave..."
													],
													"items" => ["generator"],
													"dirs" => [
														"light" => [
															"text" => [
																"$space",
																"                        ",
																"++                     .",
																"~~|                 (---",
																"~~~o            [=o=====",
																"~~|                 (---",
																"++                     .",
																"                        ",
																"",
																"You've reached the end of rails.",
																"But something is on the other side...",
																"",
																"",
																"Thanks for playing this little map showing the use",
																"of &bTGE&r! :) Hope you had fun. See ya!",
																""
															],
															"dirs" => ["END" => []]
														]
													]
												]
											]
										]
									]
								]
							]
						]
					]
				]
			]
		],
		"pub" => [
			"text" => [
				"$space",
				"       -----------      ",
				"      |o.       []|     ",
				"------+.   .o.  --+     ",
				" ..             | |     ",
				"------+.   .o.  --+     ",
				"      |o.       .o|     ",
				"       -----------      ",
				"",
				"You're at a lonely bar that seems lke from a western book.",
				"You can see some tables around.. but...",
				"Type &fcd .. &rto go back."
			],
			"dirs" => [
				"hole" => [
					"text" => [
						"$space",
						"-]-==--==--==--==-     ",
						" ]              []|     ",
						"-]=--==--==--==---      ",
						"                        ",
						"                        ",
						"                        ",
						"                        ",
						"",
						"*cough* *cough* You're going with a lantern, but there's",
						"really dirty air, you can barely breath."
					],
					"items" => ["lantern"],
					"pick" => ["doorcode"],
					"dirs" => [
						"lab" => [
							"text" => [
								"$space",
								"     --===----===--     ",
								"    --+ oo    oo +--    ",
								"   -+  ===        @ +-]-",
								"   ;; | G |           ] ",
								"   -+  ===        @ +-]=",
								"    --+ oo    oo +--    ",
								"     --===----===--     ",
								"",
								"Chemicals...chemicals everywhere. And a power generator."
							],
							"items" => ["doorcode"],
							"pick" => ["generator"],
							"dirs" => ["no_way" => []]
						]
					]
				]
			]
		]
	]
];