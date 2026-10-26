/**
 * Catálogo de animais do jogo.
 * Cada entrada: { imagem, nome, en, categoria }
 * `nome` é o nome em português; `en` é o nome em inglês.
 * `imagem` é o caminho de uma foto em assets/img/ (créditos em assets/img/CREDITOS.md).
 *
 * Categorias: "domestico" | "fazenda" | "selva" | "brasileiro" | "mar" | "ave" | "inseto"
 * As categorias permitem filtrar por dificuldade ou tema no futuro.
 */
export const ANIMAIS = Object.freeze([
  // Domésticos
  { imagem: 'assets/img/gato.jpg', nome: 'gato', en: 'cat',              categoria: 'domestico'  },
  { imagem: 'assets/img/cachorro.jpg', nome: 'cachorro', en: 'dog',          categoria: 'domestico'  },
  { imagem: 'assets/img/coelho.jpg', nome: 'coelho', en: 'rabbit',            categoria: 'domestico'  },
  { imagem: 'assets/img/hamster.jpg', nome: 'hamster', en: 'hamster',           categoria: 'domestico'  },
  { imagem: 'assets/img/peixe.jpg', nome: 'peixe', en: 'fish',             categoria: 'domestico'  },

  // Fazenda
  { imagem: 'assets/img/vaca.jpg', nome: 'vaca', en: 'cow',              categoria: 'fazenda'    },
  { imagem: 'assets/img/porco.jpg', nome: 'porco', en: 'pig',             categoria: 'fazenda'    },
  { imagem: 'assets/img/galinha.jpg', nome: 'galinha', en: 'hen',           categoria: 'fazenda'    },
  { imagem: 'assets/img/cavalo.jpg', nome: 'cavalo', en: 'horse',            categoria: 'fazenda'    },
  { imagem: 'assets/img/ovelha.jpg', nome: 'ovelha', en: 'sheep',            categoria: 'fazenda'    },
  { imagem: 'assets/img/pato.jpg', nome: 'pato', en: 'duck',              categoria: 'fazenda'    },
  { imagem: 'assets/img/cabra.jpg', nome: 'cabra', en: 'goat',             categoria: 'fazenda'    },
  { imagem: 'assets/img/burro.jpg', nome: 'burro', en: 'donkey',             categoria: 'fazenda'    },
  { imagem: 'assets/img/galo.jpg', nome: 'galo', en: 'rooster',              categoria: 'fazenda'    },

  // Selva / Zoo
  { imagem: 'assets/img/leao.jpg', nome: 'leão', en: 'lion',              categoria: 'selva'      },
  { imagem: 'assets/img/tigre.jpg', nome: 'tigre', en: 'tiger',             categoria: 'selva'      },
  { imagem: 'assets/img/elefante.jpg', nome: 'elefante', en: 'elephant',          categoria: 'selva'      },
  { imagem: 'assets/img/girafa.jpg', nome: 'girafa', en: 'giraffe',            categoria: 'selva'      },
  { imagem: 'assets/img/macaco.jpg', nome: 'macaco', en: 'monkey',            categoria: 'selva'      },
  { imagem: 'assets/img/gorila.jpg', nome: 'gorila', en: 'gorilla',            categoria: 'selva'      },
  { imagem: 'assets/img/zebra.jpg', nome: 'zebra', en: 'zebra',             categoria: 'selva'      },
  { imagem: 'assets/img/rinoceronte.jpg', nome: 'rinoceronte', en: 'rhinoceros',       categoria: 'selva'      },
  { imagem: 'assets/img/hipopotamo.jpg', nome: 'hipopótamo', en: 'hippo',        categoria: 'selva'      },
  { imagem: 'assets/img/urso.jpg', nome: 'urso', en: 'bear',              categoria: 'selva'      },
  { imagem: 'assets/img/panda.jpg', nome: 'panda', en: 'panda',             categoria: 'selva'      },
  { imagem: 'assets/img/coala.jpg', nome: 'coala', en: 'koala',             categoria: 'selva'      },
  { imagem: 'assets/img/canguru.jpg', nome: 'canguru', en: 'kangaroo',           categoria: 'selva'      },
  { imagem: 'assets/img/raposa.jpg', nome: 'raposa', en: 'fox',            categoria: 'selva'      },
  { imagem: 'assets/img/lobo.jpg', nome: 'lobo', en: 'wolf',              categoria: 'selva'      },
  { imagem: 'assets/img/guaxinim.jpg', nome: 'guaxinim', en: 'raccoon',          categoria: 'selva'      },
  { imagem: 'assets/img/ourico.jpg', nome: 'ouriço', en: 'hedgehog',            categoria: 'selva'      },
  { imagem: 'assets/img/lhama.jpg', nome: 'lhama', en: 'llama',             categoria: 'selva'      },
  { imagem: 'assets/img/crocodilo.jpg', nome: 'crocodilo', en: 'crocodile',         categoria: 'selva'      },
  { imagem: 'assets/img/cobra.jpg', nome: 'cobra', en: 'snake',             categoria: 'selva'      },

  // Brasileiros / fauna local
  { imagem: 'assets/img/onca.jpg', nome: 'onça', en: 'jaguar',              categoria: 'brasileiro' },
  { imagem: 'assets/img/preguica.jpg', nome: 'preguiça', en: 'sloth',          categoria: 'brasileiro' },
  { imagem: 'assets/img/arara.jpg', nome: 'arara', en: 'macaw',             categoria: 'brasileiro' },
  { imagem: 'assets/img/jacare.jpg', nome: 'jacaré', en: 'caiman',            categoria: 'brasileiro' },
  { imagem: 'assets/img/capivara.jpg', nome: 'capivara', en: 'capybara',          categoria: 'brasileiro' },
  { imagem: 'assets/img/tamandua.jpg', nome: 'tamanduá', en: 'anteater',          categoria: 'brasileiro' },

  // Mar
  { imagem: 'assets/img/golfinho.jpg', nome: 'golfinho', en: 'dolphin',          categoria: 'mar'        },
  { imagem: 'assets/img/baleia.jpg', nome: 'baleia', en: 'whale',            categoria: 'mar'        },
  { imagem: 'assets/img/tubarao.jpg', nome: 'tubarão', en: 'shark',           categoria: 'mar'        },
  { imagem: 'assets/img/polvo.jpg', nome: 'polvo', en: 'octopus',             categoria: 'mar'        },
  { imagem: 'assets/img/caranguejo.jpg', nome: 'caranguejo', en: 'crab',        categoria: 'mar'        },
  { imagem: 'assets/img/lagosta.jpg', nome: 'lagosta', en: 'lobster',           categoria: 'mar'        },
  { imagem: 'assets/img/tartaruga.jpg', nome: 'tartaruga', en: 'turtle',         categoria: 'mar'        },
  { imagem: 'assets/img/baiacu.jpg', nome: 'baiacu', en: 'pufferfish',            categoria: 'mar'        },
  { imagem: 'assets/img/foca.jpg', nome: 'foca', en: 'seal',              categoria: 'mar'        },
  { imagem: 'assets/img/lula.jpg', nome: 'lula', en: 'squid',              categoria: 'mar'        },

  // Aves
  { imagem: 'assets/img/aguia.jpg', nome: 'águia', en: 'eagle',             categoria: 'ave'        },
  { imagem: 'assets/img/coruja.jpg', nome: 'coruja', en: 'owl',            categoria: 'ave'        },
  { imagem: 'assets/img/pavao.jpg', nome: 'pavão', en: 'peacock',             categoria: 'ave'        },
  { imagem: 'assets/img/flamingo.jpg', nome: 'flamingo', en: 'flamingo',          categoria: 'ave'        },
  { imagem: 'assets/img/pinguim.jpg', nome: 'pinguim', en: 'penguin',           categoria: 'ave'        },
  { imagem: 'assets/img/cisne.jpg', nome: 'cisne', en: 'swan',             categoria: 'ave'        },
  { imagem: 'assets/img/papagaio.jpg', nome: 'papagaio', en: 'parrot',          categoria: 'ave'        },
  { imagem: 'assets/img/passarinho.jpg', nome: 'passarinho', en: 'bird',        categoria: 'ave'        },
  { imagem: 'assets/img/tucano.jpg', nome: 'tucano', en: 'toucan',            categoria: 'ave'        },

  // Insetos / pequenos
  { imagem: 'assets/img/borboleta.jpg', nome: 'borboleta', en: 'butterfly',         categoria: 'inseto'     },
  { imagem: 'assets/img/abelha.jpg', nome: 'abelha', en: 'bee',            categoria: 'inseto'     },
  { imagem: 'assets/img/joaninha.jpg', nome: 'joaninha', en: 'ladybug',          categoria: 'inseto'     },
  { imagem: 'assets/img/grilo.jpg', nome: 'grilo', en: 'cricket',             categoria: 'inseto'     },
  { imagem: 'assets/img/sapo.jpg', nome: 'sapo', en: 'frog',              categoria: 'inseto'     },
  { imagem: 'assets/img/caracol.jpg', nome: 'caracol', en: 'snail',           categoria: 'inseto'     },
]);
