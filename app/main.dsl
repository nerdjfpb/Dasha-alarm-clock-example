import "commonReactions/all.dsl";

context
{
    input phone: string;
}

start node root
{
    do
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
        #sayText("Hello there! I am from Dasha AI and trying to call you as you requested! Are you interested to play a game?");
        wait *;
    }
    transitions
    {
        yes: goto yes on #messageHasIntent("yes");
        no: goto no on #messageHasIntent("no");
    }
}

node yes
{
    do
    {
        #sayText("I am tall when I am young, and I am short when I am old. What am I?");
        wait *;
    }
    
    transitions
    {
        correct: goto correct on #messageHasIntent("correctAnswer");
        no: goto no on #messageHasIntent("no");
    }
}

node correct
{
    do
    {
        #sayText("This is a correct answer! Have a nice morning!");
        exit;
    }
}

node no
{
    do
    {
        #say("no");
        exit;
    }
}
