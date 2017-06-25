const context = (<any>require).context('.',  true, /\.spec\.ts$/);
context.keys().forEach(context);