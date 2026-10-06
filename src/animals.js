/**
 * Catálogo de animais do jogo.
 * Cada entrada: { emoji, nome, categoria }
 *
 * Categorias: "domestico" | "fazenda" | "selva" | "brasileiro" | "mar" | "ave" | "inseto"
 * As categorias permitem filtrar por dificuldade ou tema no futuro.
 */
export const ANIMAIS = Object.freeze([
  // Domésticos
  { emoji: '🐱', nome: 'gato',              categoria: 'domestico'  },
  { emoji: '🐶', nome: 'cachorro',          categoria: 'domestico'  },
  { emoji: '🐰', nome: 'coelho',            categoria: 'domestico'  },
  { emoji: '🐹', nome: 'hamster',           categoria: 'domestico'  },
  { emoji: '🐠', nome: 'peixe',             categoria: 'domestico'  },

  // Fazenda
  { emoji: '🐮', nome: 'vaca',              categoria: 'fazenda'    },
  { emoji: '🐷', nome: 'porco',             categoria: 'fazenda'    },
  { emoji: '🐔', nome: 'galinha',           categoria: 'fazenda'    },
  { emoji: '🐴', nome: 'cavalo',            categoria: 'fazenda'    },
  { emoji: '🐑', nome: 'ovelha',            categoria: 'fazenda'    },
  { emoji: '🦆', nome: 'pato',              categoria: 'fazenda'    },
  { emoji: '🐐', nome: 'cabra',             categoria: 'fazenda'    },
  { emoji: '🫏', nome: 'burro',             categoria: 'fazenda'    },
  { emoji: '🐓', nome: 'galo',              categoria: 'fazenda'    },

  // Selva / Zoo
  { emoji: '🦁', nome: 'leão',              categoria: 'selva'      },
  { emoji: '🐯', nome: 'tigre',             categoria: 'selva'      },
  { emoji: '🐘', nome: 'elefante',          categoria: 'selva'      },
  { emoji: '🦒', nome: 'girafa',            categoria: 'selva'      },
  { emoji: '🐒', nome: 'macaco',            categoria: 'selva'      },
  { emoji: '🦍', nome: 'gorila',            categoria: 'selva'      },
  { emoji: '🦓', nome: 'zebra',             categoria: 'selva'      },
  { emoji: '🦏', nome: 'rinoceronte',       categoria: 'selva'      },
  { emoji: '🦛', nome: 'hipopótamo',        categoria: 'selva'      },
  { emoji: '🐻', nome: 'urso',              categoria: 'selva'      },
  { emoji: '🐼', nome: 'panda',             categoria: 'selva'      },
  { emoji: '🐨', nome: 'coala',             categoria: 'selva'      },
  { emoji: '🦘', nome: 'canguru',           categoria: 'selva'      },
  { emoji: '🦊', nome: 'raposa',            categoria: 'selva'      },
  { emoji: '🐺', nome: 'lobo',              categoria: 'selva'      },
  { emoji: '🦝', nome: 'guaxinim',          categoria: 'selva'      },
  { emoji: '🦔', nome: 'ouriço',            categoria: 'selva'      },
  { emoji: '🦙', nome: 'lhama',             categoria: 'selva'      },
  { emoji: '🐊', nome: 'crocodilo',         categoria: 'selva'      },
  { emoji: '🐍', nome: 'cobra',             categoria: 'selva'      },

  // Brasileiros / fauna local
  { emoji: '🐆', nome: 'onça',              categoria: 'brasileiro' },
  { emoji: '🦥', nome: 'preguiça',          categoria: 'brasileiro' },
  { emoji: '🦜', nome: 'arara',             categoria: 'brasileiro' },
  { emoji: '🐊', nome: 'jacaré',            categoria: 'brasileiro' },
  { emoji: '🐭', nome: 'capivara',          categoria: 'brasileiro' },
  { emoji: '🐜', nome: 'tamanduá',          categoria: 'brasileiro' },

  // Mar
  { emoji: '🐬', nome: 'golfinho',          categoria: 'mar'        },
  { emoji: '🐋', nome: 'baleia',            categoria: 'mar'        },
  { emoji: '🦈', nome: 'tubarão',           categoria: 'mar'        },
  { emoji: '🐙', nome: 'polvo',             categoria: 'mar'        },
  { emoji: '🦀', nome: 'caranguejo',        categoria: 'mar'        },
  { emoji: '🦞', nome: 'lagosta',           categoria: 'mar'        },
  { emoji: '🐢', nome: 'tartaruga',         categoria: 'mar'        },
  { emoji: '🐡', nome: 'baiacu',            categoria: 'mar'        },
  { emoji: '🦭', nome: 'foca',              categoria: 'mar'        },
  { emoji: '🦑', nome: 'lula',              categoria: 'mar'        },

  // Aves
  { emoji: '🦅', nome: 'águia',             categoria: 'ave'        },
  { emoji: '🦉', nome: 'coruja',            categoria: 'ave'        },
  { emoji: '🦚', nome: 'pavão',             categoria: 'ave'        },
  { emoji: '🦩', nome: 'flamingo',          categoria: 'ave'        },
  { emoji: '🐧', nome: 'pinguim',           categoria: 'ave'        },
  { emoji: '🦢', nome: 'cisne',             categoria: 'ave'        },
  { emoji: '🦜', nome: 'papagaio',          categoria: 'ave'        },
  { emoji: '🐦', nome: 'passarinho',        categoria: 'ave'        },
  { emoji: '🦤', nome: 'tucano',            categoria: 'ave'        },

  // Insetos / pequenos
  { emoji: '🦋', nome: 'borboleta',         categoria: 'inseto'     },
  { emoji: '🐝', nome: 'abelha',            categoria: 'inseto'     },
  { emoji: '🐞', nome: 'joaninha',          categoria: 'inseto'     },
  { emoji: '🦗', nome: 'grilo',             categoria: 'inseto'     },
  { emoji: '🐸', nome: 'sapo',              categoria: 'inseto'     },
  { emoji: '🐌', nome: 'caracol',           categoria: 'inseto'     },
]);
