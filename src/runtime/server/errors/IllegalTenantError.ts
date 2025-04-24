export class IllegalTenantError extends Error {
    constructor(illegalTenantId: string, appName: string) {
        super(`Illegal tenant. Tenant with id "${illegalTenantId}" does not exists in multi tenancy app "${appName}".`);
        this.name = 'IllegalTenantError';

        // Set the prototype explicitly to maintain instanceof behavior
        Object.setPrototypeOf(this, IllegalTenantError.prototype);
    }
}
