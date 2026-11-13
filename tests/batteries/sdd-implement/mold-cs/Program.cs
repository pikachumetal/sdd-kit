var failures = Tests.Run();
Console.WriteLine(failures == 0 ? "todo en verde" : $"{failures} test(s) en rojo");
return failures == 0 ? 0 : 1;
