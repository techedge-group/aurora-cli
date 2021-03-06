import { Command, CliUx, Flags } from '@oclif/core';
import * as shell from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as chalk from 'chalk';
import * as emoji from 'node-emoji';
import * as logSymbols from 'log-symbols';
import { TemplateElement, Operations, Prompter, cliterConfig } from '../../@cliter';

export default class Seed extends Command
{
    static description = 'Seed database with bounded context or module selected';

    static flags = {
        help          : Flags.help({ char: 'h' }),
        module        : Flags.string({ char: 'm' }),
        boundedContext: Flags.string({ char: 'b' }),
        log           : Flags.boolean({ char: 'l' }),
    };

    static args = [
        {
            name       : 'elementType',
            required   : true,
            description: 'Type element to create',
            options    : ['bounded-context', 'b', 'module', 'm'],
        },
    ];

    async run()
    {
        const { args, flags } = await this.parse(Seed);

        if (args.elementType === 'b') args.elementType = TemplateElement.BACK_BOUNDED_CONTEXT;
        if (args.elementType === 'm') args.elementType = TemplateElement.BACK_MODULE;

        if (args.elementType === TemplateElement.BACK_MODULE)
        {
            let moduleFlag: any = {};
            if (flags.module) moduleFlag = Operations.parseFlagOfBoundedContextAndModule(this, flags.module);

            const { boundedContextName, moduleName }: any = await Prompter.promptForSeedModule(moduleFlag?.boundedContextName, moduleFlag?.moduleName);

            const seederPath = path.join('src', cliterConfig.apiContainer, boundedContextName, moduleName, 'seeder', 'seeder.ts');

            // check if seeder class exists in @api tree folders
            if (fs.existsSync(path.join(process.cwd(), seederPath)))
            {
                CliUx.ux.action.start('Creating environment');

                shell.exec(`ts-node -r tsconfig-paths/register ${seederPath}`, (error, stdout, stderr) =>
                {
                    CliUx.ux.action.stop('Environment created');
                    this.log(`%s %s Module seed ${moduleName} has been loaded %s`, chalk.green.bold('DONE'), emoji.get('open_file_folder'), logSymbols.success);

                    if (flags.log && error) console.error(error);
                });
            }
            else
            {
                this.log(`%s Module ${moduleName} does not contain seed to run %s`, chalk.yellow.bold('WARNING'), logSymbols.warning);
            }
        }

        if (args.elementType === TemplateElement.BACK_BOUNDED_CONTEXT)
        {
            const { boundedContextName }: any = await Prompter.promptForSeedBoundedContext(flags.boundedContext);

            const seederPath = path.join('src', cliterConfig.apiContainer, boundedContextName, 'seeder', 'seeder.ts');

            // check if seeder class exists in @api tree folders
            if (fs.existsSync(path.join(process.cwd(), seederPath)))
            {
                CliUx.ux.action.start('Creating environment');

                shell.exec(`ts-node -r tsconfig-paths/register ${seederPath}`, (error, stdout, stderr) =>
                {
                    CliUx.ux.action.stop('Environment created');
                    this.log(`%s %s Bounded Context seed ${boundedContextName} has been loaded %s`, chalk.green.bold('DONE'), emoji.get('open_file_folder'), logSymbols.success);
                });
            }
            else
            {
                this.log(`%s Bounded Context ${boundedContextName} does not contain seed to run %s`, chalk.yellow.bold('WARNING'), logSymbols.warning);
            }
        }
    }
}
