﻿CREATE TABLE [dbo].[Thread]
(
	[Id] INT NOT NULL PRIMARY KEY IDENTITY(1, 1),
	[To] VARCHAR(255) NOT NULL,
	[From] VARCHAR(255) NOT NULL,
    [BookId] INT NOT NULL, 
    [DateAdded] DATETIME2 NOT NULL DEFAULT GETDATE(), 
    [IsDeleted] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_Thread_Book] FOREIGN KEY ([BookId]) REFERENCES [Book]([Id]), 
)
