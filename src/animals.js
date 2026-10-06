/**
 * Catálogo de animais do jogo.
 * Cada entrada: { imagem, nome, categoria }
 * `imagem` é o caminho de uma foto em assets/img/ (créditos em assets/img/CREDITOS.md).
 *
 * Categorias: "domestico" | "fazenda" | "selva" | "brasileiro" | "mar" | "ave" | "inseto"
 * As categorias permitem filtrar por dificuldade ou tema no futuro.
 */
export const ANIMAIS = Object.freeze([
  // Domésticos
  { imagem: 'assets/img/gato.jpg', nome: 'gato',              categoria: 'domestico'  },
  { imagem: 'assets/img/cachorro.jpg', nome: 'cachorro',          categoria: 'domestico'  },
  { imagem: 'assets/img/coelho.jpg', nome: 'coelho',            categoria: 'domestico'  },
  { imagem: 'assets/img/hamster.jpg', nome: 'hamster',           categoria: 'domestico'  },
  { imagem: 'assets/img/peixe.jpg', nome: 'peixe',             categoria: 'domestico'  },

  // Fazenda
  { imagem: 'assets/img/vaca.jpg', nome: 'vaca',              categoria: 'fazenda'    },
  { imagem: 'assets/img/porco.jpg', nome: 'porco',             categoria: 'fazenda'    },
  { imagem: 'assets/img/galinha.jpg', nome: 'galinha',           categoria: 'fazenda'    },
  { imagem: 'assets/img/cavalo.jpg', nome: 'cavalo',            categoria: 'fazenda'    },
  { imagem: 'assets/img/ovelha.jpg', nome: 'ovelha',            categoria: 'fazenda'    },
  { imagem: 'assets/img/pato.jpg', nome: 'pato',              categoria: 'fazenda'    },
  { imagem: 'assets/img/cabra.jpg', nome: 'cabra',             categoria: 'fazenda'    },
  { imagem: 'assets/img/burro.jpg', nome: 'burro',             categoria: 'fazenda'    },
  { imagem: 'assets/img/galo.jpg', nome: 'galo',              categoria: 'fazenda'    },

  // Selva / Zoo
  { imagem: 'assets/img/leao.jpg', nome: 'leão',              categoria: 'selva'      },
  { imagem: 'assets/img/tigre.jpg', nome: 'tigre',             categoria: 'selva'      },
  { imagem: 'assets/img/elefante.jpg', nome: 'elefante',          categoria: 'selva'      },
  { imagem: 'assets/img/girafa.jpg', nome: 'girafa',            categoria: 'selva'      },
  { imagem: 'assets/img/macaco.jpg', nome: 'macaco',            categoria: 'selva'      },
  { imagem: 'assets/img/gorila.jpg', nome: 'gorila',            categoria: 'selva'      },
  { imagem: 'assets/img/zebra.jpg', nome: 'zebra',             categoria: 'selva'      },
  { imagem: 'assets/img/rinoceronte.jpg', nome: 'rinoceronte',       categoria: 'selva'      },
  { imagem: 'assets/img/hipopotamo.jpg', nome: 'hipopótamo',        categoria: 'selva'      },
  { imagem: 'assets/img/urso.jpg', nome: 'urso',              categoria: 'selva'      },
  { imagem: 'assets/img/panda.jpg', nome: 'panda',             categoria: 'selva'      },
  { imagem: 'assets/img/coala.jpg', nome: 'coala',             categoria: 'selva'      },
  { imagem: 'assets/img/canguru.jpg', nome: 'canguru',           categoria: 'selva'      },
  { imagem: 'assets/img/raposa.jpg', nome: 'raposa',            categoria: 'selva'      },
  { imagem: 'assets/img/lobo.jpg', nome: 'lobo',              categoria: 'selva'      },
  { imagem: 'assets/img/guaxinim.jpg', nome: 'guaxinim',          categoria: 'selva'      },
  { imagem: 'assets/img/ourico.jpg', nome: 'ouriço',            categoria: 'selva'      },
  { imagem: 'assets/img/lhama.jpg', nome: 'lhama',             categoria: 'selva'      },
  { imagem: 'assets/img/crocodilo.jpg', nome: 'crocodilo',         categoria: 'selva'      },
  { imagem: 'assets/img/cobra.jpg', nome: 'cobra',             categoria: 'selva'      },

  // Brasileiros / fauna local
  { imagem: 'assets/img/onca.jpg', nome: 'onça',              categoria: 'brasileiro' },
  { imagem: 'assets/img/preguica.jpg', nome: 'preguiça',          categoria: 'brasileiro' },
  { imagem: 'assets/img/arara.jpg', nome: 'arara',             categoria: 'brasileiro' },
  { imagem: 'assets/img/jacare.jpg', nome: 'jacaré',            categoria: 'brasileiro' },
  { imagem: 'assets/img/capivara.jpg', nome: 'capivara',          categoria: 'brasileiro' },
  { imagem: 'assets/img/tamandua.jpg', nome: 'tamanduá',          categoria: 'brasileiro' },

  // Mar
  { imagem: 'assets/img/golfinho.jpg', nome: 'golfinho',          categoria: 'mar'        },
  { imagem: 'assets/img/baleia.jpg', nome: 'baleia',            categoria: 'mar'        },
  { imagem: 'assets/img/tubarao.jpg', nome: 'tubarão',           categoria: 'mar'        },
  { imagem: 'assets/img/polvo.jpg', nome: 'polvo',             categoria: 'mar'        },
  { imagem: 'assets/img/caranguejo.jpg', nome: 'caranguejo',        categoria: 'mar'        },
  { imagem: 'assets/img/lagosta.jpg', nome: 'lagosta',           categoria: 'mar'        },
  { imagem: 'assets/img/tartaruga.jpg', nome: 'tartaruga',         categoria: 'mar'        },
  { imagem: 'assets/img/baiacu.jpg', nome: 'baiacu',            categoria: 'mar'        },
  { imagem: 'assets/img/foca.jpg', nome: 'foca',              categoria: 'mar'        },
  { imagem: 'assets/img/lula.jpg', nome: 'lula',              categoria: 'mar'        },

  // Aves
  { imagem: 'assets/img/aguia.jpg', nome: 'águia',             categoria: 'ave'        },
  { imagem: 'assets/img/coruja.jpg', nome: 'coruja',            categoria: 'ave'        },
  { imagem: 'assets/img/pavao.jpg', nome: 'pavão',             categoria: 'ave'        },
  { imagem: 'assets/img/flamingo.jpg', nome: 'flamingo',          categoria: 'ave'        },
  { imagem: 'assets/img/pinguim.jpg', nome: 'pinguim',           categoria: 'ave'        },
  { imagem: 'assets/img/cisne.jpg', nome: 'cisne',             categoria: 'ave'        },
  { imagem: 'assets/img/papagaio.jpg', nome: 'papagaio',          categoria: 'ave'        },
  { imagem: 'assets/img/passarinho.jpg', nome: 'passarinho',        categoria: 'ave'        },
  { imagem: 'assets/img/tucano.jpg', nome: 'tucano',            categoria: 'ave'        },

  // Insetos / pequenos
  { imagem: 'assets/img/borboleta.jpg', nome: 'borboleta',         categoria: 'inseto'     },
  { imagem: 'assets/img/abelha.jpg', nome: 'abelha',            categoria: 'inseto'     },
  { imagem: 'assets/img/joaninha.jpg', nome: 'joaninha',          categoria: 'inseto'     },
  { imagem: 'assets/img/grilo.jpg', nome: 'grilo',             categoria: 'inseto'     },
  { imagem: 'assets/img/sapo.jpg', nome: 'sapo',              categoria: 'inseto'     },
  { imagem: 'assets/img/caracol.jpg', nome: 'caracol',           categoria: 'inseto'     },
]);
