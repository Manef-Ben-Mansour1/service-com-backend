import { CreateDateColumn, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class TimestampEntity {



    @CreateDateColumn({
        update: false
    })
    createdAt: Date;

    @UpdateDateColumn({nullable: true})
    updatedAt: Date;

    @DeleteDateColumn()
    deletedAt: Date;

}