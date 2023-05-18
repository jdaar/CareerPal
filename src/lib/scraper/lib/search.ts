import * as dotenv from 'dotenv';
dotenv.config();
import { DEFAULT_TAGS, EXCLUDED_TOKENS } from './dictionaries';
import { log } from './io';
import { Configuration, OpenAIApi } from 'openai';
import Fuse from 'fuse.js';

const memoizedClosestTechnologyName = new Map<string, string>();

/**
 * Gets the closest technology name from the CUSTOM_TECHNOLOGIES dictionary.
 * @param input The input string to search a technology for.
 * @returns The closest technology name or null if no technology was found.
 * @example
 * const closestTechnologyName = findClosestTechnologyName('react')
 * console.log(closestTechnologyName) // React
 * @since 1.0.0
 * @deprecated Use OpenAI instead
 */
export function findClosestTechnologyName(input: string): string | null {
	if (memoizedClosestTechnologyName.has(input.toLowerCase())) {
		log('debug', 'findClosestTechnologyName', `Found ${input} in memoized map`);
		return memoizedClosestTechnologyName.get(input.toLowerCase()) ?? null;
	}
	if (EXCLUDED_TOKENS.includes(input.toLowerCase())) {
		return null;
	}

	let closestMatch = '';
	let minDistance = Infinity;
	for (const techName of DEFAULT_TAGS) {
		if (techName.toLowerCase() === input.toLowerCase()) {
			log('debug', 'findClosestTechnologyName', `Found exact match for ${input}`);
			return techName;
		}
		if (techName.length < 3 || input.length < 3) {
			continue;
		}
		const distance = getLevenshteinDistance(techName.toLowerCase(), input.toLowerCase());
		if (distance < minDistance) {
			minDistance = distance;
			closestMatch = techName;
		}
	}
	if (minDistance > 3) {
		return null;
	}
	memoizedClosestTechnologyName.set(input, closestMatch);
	log(
		'debug',
		'findClosestTechnologyName',
		`Found closest match for ${input}: ${closestMatch} (distance: ${minDistance}) and memoized it`
	);
	return closestMatch;
}

/**
 * Gets the Levenshtein distance between two strings.
 * @param str1 The first string to compare.
 * @param str2 The second string to compare.
 * @returns The Levenshtein distance between the two strings.
 * @deprecated Use OpenAI instead
 */
function getLevenshteinDistance(str1: string, str2: string): number {
	const len1 = str1.length;
	const len2 = str2.length;
	const matrix: number[][] = [];

	for (let i = 0; i <= len1; i++) {
		matrix[i] = [i];
	}

	for (let j = 0; j <= len2; j++) {
		matrix[0][j] = j;
	}

	for (let j = 1; j <= len2; j++) {
		for (let i = 1; i <= len1; i++) {
			if (str1[i - 1] === str2[j - 1]) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
			}
		}
	}

	return matrix[len1][len2];
}

/**
 * Uses openai to get the technologies from a job description.
 * @param input Text to search technologies for.
 * @returns An array with all the technologies included in the input text.
 * @since 1.0.1
 * @deprecated
 */
export async function getTechnologiesOpenAi(input: string): Promise<string[]> {
	const configuration = new Configuration({
		apiKey: process.env.OPENAI_API_KEY
	});
	const openai = new OpenAIApi(configuration);

	try {
		const response = await openai.createCompletion({
			model: 'text-davinci-003',
			prompt: `Determina unicamente las tecnologias que estan presentes en la siguiente descripcion de empleo, descartando toda descripcion del cargo como horario, tipo de contrato, modalidad, años de experiencia en el cargo, ubicaciones, habilidades blandas solicitadas, etc. Solamente se deben incluir en la salida los elementos que esten indicados explicitamente en el texto. el formato de salida debe ser una sola lista separada por comas (ejemplo: Photoshop,Illustrator,C++,C#,F#,Typescript) y en caso de no encontrar tecnologias la salida debe ser la siguiente cadena de texto "NONE"

  Humano: Buscamos un candidato con conocimientos en C#, Trabajo en equipo, C++, Unity y Unreal Engine, con gran capacidad de liderazgo. Nos encontramos situados en Medellin y la compensacion seria de 3.000.000
  AI: C#,C++,Unity,Unreal Engine

  Humano: Buscamos un programador para maquinas CNC
  AI: NONE

  Humano: conocimientos en Front-end y Back-end (Bases de datos, MySQL, Python, PHP) para realizar diseño y montaje de una base de datos de control de incentivos, premios y actualización de KPI'S en la falicitación de la búsqueda de estos.
  AI: MySQL,Python,PHP

  Humano: Empresa de Ingeniería enfocada a la creación y comercialización de productos de software busca Desarrolladores web junior o intermedios que hagan parte de su equipo. Debe tener conocimiento en desarrollo de sistemas de información, utilizando frameworks como SYMFONY o LARAVEL, Importante que sea autodidacta y que sea curioso. Así mismo, debe ser capaz de afrontar retos cognitivos para la solución de requerimientos por parte de la empresa y de sus clientes. El trabajo permite tener una curva de aprendizaje adecuada, compartir con compañeros que tienen mayor conocimiento y experiencia, participar de actividades de integración y crecimiento personal.
  AI: Symphony,Laravel

  INICIO DE LA DESCRIPCION DE EMPLEO


  ${input}


  FIN DE LA DESCRIPCION DE EMPLEO`,
			temperature: 0,
			max_tokens: 60,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0
		});

		const technologies = response.data.choices[0].text
			?.replace('\n\n', '')
			.replace('AI:', '')
			.trim()
			.toLowerCase()
			.split(',');

		return technologies ?? [];
	} catch (error) {
		console.error(`OpenAI api error: ${error}`);
	}

	return [];
}

export async function getTags(input: string, tags: string[]): Promise<Array<string>> {
	const options = {
		includeScore: true,
		minMatchCharLength: 4
	};

	const splitInput = input
		.split(' ')
		.filter((v) => EXCLUDED_TOKENS.indexOf(v.toLocaleLowerCase().trim()) === -1);
	const fuse = new Fuse(splitInput, options);

	const returnValue = new Array<string>();

	(tags.length > 0 ? tags : DEFAULT_TAGS).forEach((value) => {
		const result = fuse
			.search(value)
			.sort((a, b) => (a?.score ?? 0) - (b?.score ?? 0))
			.filter((v) => (v.score ?? 0) < 0.3);

		if (result.length > 0) {
			console.log(`${result[0].item}: ${value}`);
			returnValue.push(value);
		}
	});
	return returnValue;
}
