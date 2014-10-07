Prodio
======

Prodio in Latin means to "Come forth, appear, proceed and/or project".  It
seemed like the prefect name for a project that hopes to help to move project
management from a taboo topic into an enjoyable experience.

Prodio is NOT ready yet.  Please keep an eye out though as it is making progress.

CLI
===

To use the CLI you will need to install it:

```
npm install -g prodio-cli
```

prodio init
-----------

prodio init [name] [version] [host] [-d Description]

```
Project Name:
Project Description:
Project Version:
Project Host:
Project Username:
```

prodio set [key] [value]

```
Key:
Value:
```

Examples:
```
prodio set username jdarling
prodio set global username jdarling
```

prodio pull
-----------

prodio pull

prodio push
-----------

prodio push

prodio add
----------

prodio add [type] [value]

```
Type (user, task, group, note):
Value:
```

prodio add note to [type] [value]
```
Type (user, task, group, note):
Value:
```

Examples:
```
prodio add user jdarling
prodio add task Document things better
prodio add note to "Document things better" This is my note
```

prodio remove
-----------

prodio remove [type] [id]

```
Type (user, task, group, note):
ID:
```

Examples:
```
prodio remove note This is my note
prodio remove task Document things better
prodio remove user jdarling
```

prodio assign
-----------

prodio assign [type] [id] [user] [user...]

```
Type (user, task, group, note):
ID:
User(s):
```

prodio assigned to
----------------

prodio assigned to <who>

Examples:
```
prodio assigned to me
prodio assigned to jdarling
```

prodio unassing
-------------

prodio unassign [type] [id] [user] [user...]

```
Type (user, task, group, note):
ID:
User(s):
```

prodio update
-----------

prodio update [id] [status]

```
ID:
Status (started, completed, in progress):
```

prodio link
---------

prodio link [id] to [id]

prodio unlink
-----------

prodio unlink [id] from [id]

prodio list
---------

prodio list [id]

Sample Output: prodio list
```
0) My Project
  1) My Group
    2) Task 1
    3) Task 2
      4) Note: ...
      5) Note: ...
  6) Group 2
    7) Task 1
    8) Another Task
      9) Sub task
        10) Note: Sub task note
      11) Note: Some Note
```

prodio find
---------

prodio find <expression> [under id]
or
prodio find <expression>

Sample Output: prodio find task
```
2) Task 1
3) Task 2
7) Task 1
8) Another Task
9) Sub task
10) Note: Sub task note
```

Sample Output: prodio find task under 8
```
9) Sub task
10) Note: Sub task note
```

prodio detail
-----------

prodio detail <id> [full]

Sample Output: prodio detail 8
```
0) My Project
  6) Group 2
    8) Another Task
```
Sample Output: prodio detail 8 full

```
0) My Project
  6) Group 2
    8) Another Task
      9) Sub task
        10) Note: Sub task note
      11) Note: Some Note
```
