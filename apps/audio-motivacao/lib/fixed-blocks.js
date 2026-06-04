"use strict";

/**
 * Blocos fixos da hipnose coletiva — extraídos e generalizados dos 14 áudios do Michael.
 * São idênticos em toda geração (o usuário confirmou: "a introdução é igual pra todos").
 * Só o miolo (visualização + sugestões + mantra) muda por tema.
 *
 * Cada bloco tem { tom, texto }. Os tons batem com voxtral-voices.json:
 *   normal | hipnose | motivacional
 */

const INTRO = {
  tom: "hipnose",
  texto:
    "Ótimo. Tomando uma posição confortável agora. Respira fundo... e vai soltando o ar devagar, " +
    "desacelerando a respiração, desacelerando o corpo. Pode manter os olhos abertos por enquanto. " +
    "Respira fundo mais uma vez... e no seu tempo, enquanto você solta o ar, você fecha os seus olhos " +
    "e entra num profundo estado de transe. Ótimo. Muito bem.",
};

const APROFUNDAMENTO = {
  tom: "hipnose",
  texto:
    "Nesse momento, o seu corpo e a sua mente já estão preparados para receber as melhores sugestões. " +
    "Mas ainda assim, eu vou contar de cinco até um, para que você possa se aprofundar ainda mais nesse estado, " +
    "se sentir ainda melhor. Cinco... vai relaxando o seu corpo e a sua mente em conjunto. " +
    "Quatro... o tempo todo você tem pensamentos, ouve sons, mas nada disso te incomoda, nada disso te perturba " +
    "de nenhuma forma; só faz você querer focar ainda mais na minha voz, seguir ainda melhor as minhas instruções. " +
    "Três... sentindo muito bem. Dois... sentindo ótimo. E um... muito bem.",
};

const PONTE = {
  tom: "hipnose",
  texto:
    "Nesse momento, o seu corpo e a sua mente estão preparados para receber as melhores sugestões. " +
    "Aquelas sugestões que vão fazer a diferença no seu dia, na sua semana, no seu mês, nos seus resultados. Ótimo.",
};

const EMERSAO = {
  tom: "motivacional",
  texto:
    "Muito bem. E agora eu vou contar de um até cinco, e no número cinco você abre os seus olhos para esse dia extraordinário. " +
    "Um... sentindo ótimo, sentindo incrível, vai se conectando com o aqui e agora. " +
    "Dois... sentindo muito bem, em paz, sabendo que as escolhas estão nas suas mãos. " +
    "Três... sabendo que você é uma pessoa extraordinária, capaz, com uma energia incrível. " +
    "Quatro... o relaxamento físico vai saindo do seu corpo, seus braços e suas pernas começam a se mexer, " +
    "você já está bem conectado com o aqui e agora. " +
    "E no número cinco... olhos abertos! Sentindo ótimo, sentindo incrível, sentindo extraordinário, sentindo muito bem.",
};

const FECHAMENTO = {
  tom: "normal",
  texto:
    "E para todos nós, uma salva de palmas. Um excelente dia. Porque você escolhe que seja assim.",
};

module.exports = { INTRO, APROFUNDAMENTO, PONTE, EMERSAO, FECHAMENTO };
