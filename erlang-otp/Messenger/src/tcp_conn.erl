%%%-------------------------------------------------------------------
%%% @author ktharnkumar
%%% @copyright (C) 2026, <COMPANY>
%%% @doc
%%%
%%% @end
%%% Created : 10. Jan 2026 10:04
%%%-------------------------------------------------------------------
-module(tcp_conn).
-author("ktharnkumar").

%% API
-export([run/1]).

run(Sock) ->
  inet:setopts(Sock, [{active, once}]),
  loop(Sock).

loop(Sock) ->
  receive
    {tcp, Sock, Line0} ->
      Line = trim(Line0),
      handle_line(self(), Line),
      inet:setopts(Sock, [{active, once}]),
      loop(Sock);

    {topic_event, Topic, Payload} ->
      send_line(Sock, ["EVT ", Topic, " ", Payload]),
      loop(Sock);

    {topic_request, Topic, CorrId, Payload} ->
      send_line(Sock, ["REQ ", Topic, " ", CorrId, " ", Payload]),
      loop(Sock);

    {topic_reply, CorrId, Payload} ->
      send_line(Sock, ["REP ", CorrId, " ", Payload]),
      loop(Sock);

    {tcp_closed, Sock} ->
      ok;

    {tcp_error, Sock, _} ->
      ok
  end.

send_line(Sock, Parts) ->
  Bin = iolist_to_binary([Parts, "\n"]),
  gen_tcp:send(Sock, Bin).

trim(Bin) ->
  binary:replace(Bin, <<"\n">>, <<>>, [global]).

handle_line(ConnPid, Line) ->
  case binary:split(Line, <<" ">>, [global]) of
    [<<"SUB">>, Topic] ->
      topic_manager:subscribe(Topic, ConnPid);

    [<<"UNSUB">>, Topic] ->
      topic_manager:unsubscribe(Topic, ConnPid);

    [<<"PUB">>, Topic | Rest] ->
      topic_manager:publish(Topic, join(Rest));

    [<<"REQ">>, Topic, CorrId | Rest] ->
      Payload = join(Rest),
      topic_manager:request(Topic, CorrId, Payload, ConnPid);

    [<<"REP">>, Topic, CorrId | Rest] ->
      Payload = join(Rest),
      topic_manager:reply(Topic, CorrId, Payload);

    _ ->
      ConnPid ! {topic_event, <<"error">>, <<"bad_command">>}
  end.

join([]) -> <<>>;
join(Parts) -> iolist_to_binary(lists:join(<<" ">>, Parts)).

