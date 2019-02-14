﻿CREATE TABLE [dbo].[Message]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
    [Text] VARCHAR(1023) NOT NULL, 
    [ThreadId] INT NOT NULL, 
    [SentBy] VARCHAR(50) NOT NULL,
    [DateAdded] DATETIME2 NOT NULL DEFAULT GETDATE(), 
    [IsDeleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_Message_Thread] FOREIGN KEY ([ThreadId]) REFERENCES Thread([Id]), 
)
