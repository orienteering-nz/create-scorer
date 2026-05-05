#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function prompt(question: string): Promise<string> {
	const rl = createInterface({ input: process.stdin, output: process.stdout });
	return new Promise((resolve) => {
		rl.question(question, (answer) => {
			rl.close();
			resolve(answer.trim());
		});
	});
}

function copyTemplate(src: string, dest: string, projectName: string): void {
	mkdirSync(dest, { recursive: true });
	for (const entry of readdirSync(src)) {
		const srcPath = join(src, entry);
		const destPath = join(dest, entry);
		if (statSync(srcPath).isDirectory()) {
			copyTemplate(srcPath, destPath, projectName);
		} else {
			const content = readFileSync(srcPath, "utf-8").replaceAll("{{PROJECT_NAME}}", projectName);
			writeFileSync(destPath, content);
		}
	}
}

async function main(): Promise<void> {
	let projectName = process.argv[2];

	if (!projectName) {
		projectName = await prompt("What is your scorer name? ");
	}

	if (!projectName) {
		console.error("Error: Please provide a project name.");
		process.exit(1);
	}

	if (!/^[a-z0-9@][a-z0-9._@/-]*$/.test(projectName)) {
		console.error(`Error: "${projectName}" is not a valid project name.`);
		process.exit(1);
	}

	const projectDir = join(process.cwd(), projectName);

	if (existsSync(projectDir)) {
		console.error(`Error: Directory "${projectName}" already exists.`);
		process.exit(1);
	}

	console.log(`\nCreating scorer "${projectName}"...\n`);

	const templateDir = join(__dirname, "..", "templates", "default");
	copyTemplate(templateDir, projectDir, projectName);

	console.log(`✓ Created ${projectName} at ${projectDir}`);
	console.log("\nNext steps:");
	console.log(`  cd ${projectName}`);
	console.log("  bun install");
	console.log("  bun run dev");
	console.log("");
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});
