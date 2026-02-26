Set WshShell = CreateObject("WScript.Shell")
WshShell.Run "cmd.exe /c taskkill /F /IM node.exe /T", 0, False
