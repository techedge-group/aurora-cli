import { ChangeDetectionStrategy, Component, Injector, ViewEncapsulation } from '@angular/core';
import { Validators } from '@angular/forms';
import { Action, Crumb, log, mapActions, Utils, ViewDetailComponent } from '@aurora';
import { lastValueFrom, takeUntil } from 'rxjs';
import { {{ schema.aggregateName }} } from '../{{ toKebabCase schema.boundedContextName }}.types';
import { {{ toPascalCase schema.moduleName }}Service } from './{{ toKebabCase schema.moduleName }}.service';

@Component({
    selector       : '{{ toKebabCase schema.boundedContextName }}-{{ toKebabCase schema.moduleName }}-detail',
    templateUrl    : './{{ toKebabCase schema.moduleName }}-detail.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class {{ toPascalCase schema.moduleName }}DetailComponent extends ViewDetailComponent
{
    // ---- customizations ----
    // ..

    // Object retrieved from the database request,
    // it should only be used to obtain uninitialized
    // data in the form, such as relations, etc.
    // It should not be used habitually, since the source of truth is the form.
    managedObject: {{ schema.aggregateName }};

    // breadcrumb component definition
    breadcrumb: Crumb[] = [
        { translation: 'App' },
        { translation: '{{ toCamelCase schema.boundedContextName }}.{{ toPascalCase schema.moduleNames }}', routerLink: ['/{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}']},
        { translation: '{{ toCamelCase schema.boundedContextName }}.{{ toPascalCase schema.moduleName }}' },
    ];

    constructor(
        protected readonly injector: Injector,
        private readonly {{ toCamelCase schema.moduleName }}Service: {{ toPascalCase schema.moduleName }}Service,
    )
    {
        super(injector);
    }

    // this method will be called after the ngOnInit of
    // the parent class you can use instead of ngOnInit
    init(): void
    { /**/ }

    onSubmit($event): void
    {
        // we have two nested forms, we check that the submit comes from the button
        // that corresponds to the main form to the main form
        if ($event.submitter.getAttribute('form') !== $event.submitter.form.getAttribute('id'))
        {
            $event.preventDefault();
            $event.stopPropagation();
            return;
        }

        // manage validations before execute actions
        if (this.fg.invalid)
        {
            log('[DEBUG] Error to validate form: ', this.fg);
            this.validationMessagesService.validate();
            return;
        }

        this.actionService.action({
            id: mapActions(
                this.currentViewAction.id,
                { '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.new': '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.create', '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.edit': '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.update' },
            ),
            isViewAction: false,
        });
    }

    createForm(): void
    {
        this.fg = this.fb.group({
            {{#each schema.properties.formGroupFields}}
            {{#if (allowProperty ../schema.moduleName this) }}
            {{ toCamelCase name }}: {{#if (hasValidationFormControl .)}}[{{{initialFormGroupData .}}}, [{{#unless nullable }}Validators.required{{ hasCommaInValidationFormControl . 'nullable' }}{{/unless}}{{#if this.length}}Validators.minLength({{this.length }}), Validators.maxLength({{this.length}}){{ hasCommaInValidationFormControl . 'length' }}{{/if}}{{#if maxLength }}Validators.maxLength({{maxLength}}){{ hasCommaInValidationFormControl . 'maxLength' }}{{/if}}]]{{else}}{{{initialFormGroupData .}}}{{/if}},
            {{/if}}
            {{/each}}
        });
    }

    async handleAction(action: Action): Promise<void>
    {
        // add optional chaining (?.) to avoid first call where behaviour subject is undefined
        switch (action?.id)
        {
            case '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.new':
                this.fg.get('id').setValue(Utils.uuid());
                break;

            case '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.edit':
                this.{{ toCamelCase schema.moduleName }}Service
                    .{{ toCamelCase schema.moduleName }}$
                    .pipe(takeUntil(this.unsubscribeAll$))
                    .subscribe(item =>
                    {
                        this.managedObject = item;
                        this.fg.patchValue(item);
                    });
                break;

            case '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.create':
                try
                {
                    await lastValueFrom(
                        this.{{ toCamelCase schema.moduleName }}Service
                            .create<{{ schema.aggregateName }}>({ object: this.fg.value }),
                    );

                    this.snackBar.open(
                        `${this.translocoService.translate('{{ toCamelCase schema.boundedContextName }}.{{ toPascalCase schema.moduleName }}')} ${this.translocoService.translate('Created.M')}`,
                        undefined,
                        {
                            verticalPosition: 'top',
                            duration        : 3000,
                        },
                    );

                    this.router.navigate(['{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}']);
                }
                catch(error)
                {
                    log(`[DEBUG] Catch error in {{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.create action: ${error}`);
                }
                break;

            case '{{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.update':
                try
                {
                    await lastValueFrom(
                        this.{{ toCamelCase schema.moduleName }}Service
                            .updateById<{{ schema.aggregateName }}>({ object: this.fg.value }),
                    );

                    this.snackBar.open(
                        `${this.translocoService.translate('{{ toCamelCase schema.boundedContextName }}.{{ toPascalCase schema.moduleName }}')} ${this.translocoService.translate('Saved.M')}`,
                        undefined,
                        {
                            verticalPosition: 'top',
                            duration        : 3000,
                        },
                    );

                    this.router.navigate(['{{ toKebabCase schema.boundedContextName }}/{{ toKebabCase schema.moduleName }}']);
                }
                catch(error)
                {
                    log(`[DEBUG] Catch error in {{ toCamelCase schema.boundedContextName }}::{{ toCamelCase schema.moduleName }}.detail.update action: ${error}`);
                }
                break;
        }
    }
}
