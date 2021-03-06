import { AggregateRoot } from '@nestjs/cqrs';
import { IamBoundedContext } from '../../domain/bounded-context.aggregate';
import { CreatedBoundedContextEvent } from './created-bounded-context.event';
import { CreatedBoundedContextsEvent } from './created-bounded-contexts.event';
import { UpdatedBoundedContextEvent } from './updated-bounded-context.event';
import { UpdatedBoundedContextsEvent } from './updated-bounded-contexts.event';
import { DeletedBoundedContextEvent } from './deleted-bounded-context.event';
import { DeletedBoundedContextsEvent } from './deleted-bounded-contexts.event';

export class AddBoundedContextsContextEvent extends AggregateRoot
{
    constructor(
        public readonly aggregateRoots: IamBoundedContext[] = [],
    )
    {
        super();
    }

    *[Symbol.iterator]()
    {
        for (const aggregateRoot of this.aggregateRoots) yield aggregateRoot;
    }

    created(): void
    {
        this.apply(
            new CreatedBoundedContextsEvent(
                this.aggregateRoots.map(boundedContext =>
                    new CreatedBoundedContextEvent(
                        boundedContext.id.value,
                        boundedContext.name.value,
                        boundedContext.root.value,
                        boundedContext.sort?.value,
                        boundedContext.isActive.value,
                        boundedContext.createdAt?.value,
                        boundedContext.updatedAt?.value,
                        boundedContext.deletedAt?.value,
                    ),
                ),
            ),
        );
    }

    updated(): void
    {
        this.apply(
            new UpdatedBoundedContextsEvent(
                this.aggregateRoots.map(boundedContext =>
                    new UpdatedBoundedContextEvent(
                        boundedContext.id.value,
                        boundedContext.name.value,
                        boundedContext.root.value,
                        boundedContext.sort?.value,
                        boundedContext.isActive.value,
                        boundedContext.createdAt?.value,
                        boundedContext.updatedAt?.value,
                        boundedContext.deletedAt?.value,
                    ),
                ),
            ),
        );
    }

    deleted(): void
    {
        this.apply(
            new DeletedBoundedContextsEvent(
                this.aggregateRoots.map(boundedContext =>
                    new DeletedBoundedContextEvent(
                        boundedContext.id.value,
                        boundedContext.name.value,
                        boundedContext.root.value,
                        boundedContext.sort?.value,
                        boundedContext.isActive.value,
                        boundedContext.createdAt?.value,
                        boundedContext.updatedAt?.value,
                        boundedContext.deletedAt?.value,
                    ),
                ),
            ),
        );
    }
}