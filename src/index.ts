#!/usr/bin/env node
import * as p from "@clack/prompts";
import { Command } from "commander";
import { downloadTemplate } from "giget";
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
const NAME_RE = /^[a-z0-9@][a-z0-9._@/-]*$/;

function validateName(value: string | undefined): string | undefined {
	if (!value) return "Project name is required";
	if (!NAME_RE.test(value)) return `"${value}" is not a valid project name`;
}

function substituteTemplate(dir: string, projectName: string): void {
	for (const entry of readdirSync(dir)) {
		const fullPath = join(dir, entry);
		if (statSync(fullPath).isDirectory()) {
			substituteTemplate(fullPath, projectName);
		} else {
			const content = readFileSync(fullPath, "utf-8");
			if (content.includes("{{PROJECT_NAME}}")) {
				writeFileSync(fullPath, content.replaceAll("{{PROJECT_NAME}}", projectName));
			}
		}
	}
}

async function main(): Promise<void> {
	const program = new Command();

	program
		.name("create-scorer")
		.description("Scaffold a new scorer app")
		.argument("[project-name]", "Name of the scorer project")
		.action(async (projectNameArg?: string) => {
			p.intro("create-scorer");

			let projectName = projectNameArg;

			if (!projectName) {
				const answer = await p.text({
					message: "What is your scorer name?",
					validate: validateName,
				});

				if (p.isCancel(answer)) {
					p.cancel("Operation cancelled.");
					process.exit(0);
				}

				projectName = answer;
			} else {
				const err = validateName(projectName);
				if (err) {
					p.log.error(err);
					process.exit(1);
				}
			}

			const projectDir = join(process.cwd(), projectName);

			const spin = p.spinner();
			spin.start(`Creating scorer "${projectName}"`);

			if (existsSync(projectDir)) {
				p.log.error(`Directory "${projectName}" already exists.`);
				process.exit(1);
			}

			try {
				await downloadTemplate("github:orienteering-nz/create-scorer/templates/default", {
					dir: projectDir,
				});
				substituteTemplate(projectDir, projectName);
			} catch (error) {
				spin.stop("Failed to create scorer");
				p.log.error(error instanceof Error ? error.message : String(error));
				process.exit(1);
			}

			spin.stop(`Created ${projectName}`);
			p.note(`cd ${projectName}\nbun install\nbun run dev`, "Next steps");
			p.outro("Happy coding! 🎯");
		});

	await program.parseAsync();
}

main().catch((error: unknown) => {
	console.error(error);
	process.exit(1);
});

